/**
 * 搜索逻辑控件
 *
 * Created by GUY on 2015/9/28.
 * @class BI.Searcher
 * @extends BI.Widget
 */

BI.Searcher = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Searcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-searcher",
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            vgap: 0,
            hgap: 0,

            isDefaultInit: false,
            isAutoSearch: true, // 是否自动搜索
            isAutoSync: true, // 是否自动同步数据, 即是否保持搜索面板和adapter面板状态值的统一
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,

            // isAutoSearch为false时启用
            onSearch: function (op, callback) {
                callback([]);
            },

            el: {
                type: "bi.search_editor"
            },

            popup: {
                type: "bi.searcher_view"
            },

            adapter: null,
            masker: { // masker层
                offset: {}
            }
        });
    },

    render: function () {
        var self = this, o = this.options;

        this.editor = BI.createWidget(o.el, {
            type: "bi.search_editor"
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            vgap: o.vgap,
            hgap: o.hgap,
            items: [this.editor]
        });
        o.isDefaultInit && (this._assertPopupView());

        var search = BI.debounce(BI.bind(this._search, this), BI.EVENT_RESPONSE_TIME, {
            "leading": true,
            "trailing": false
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function (type) {
            switch (type) {
                case BI.Events.STARTEDIT:
                    self._startSearch();
                    break;
                case BI.Events.EMPTY:
                    self._stopSearch();
                    break;
                case BI.Events.CHANGE:
                    search();
                    break;
                case BI.Events.PAUSE:
                    if (BI.endWith(this.getValue(), BI.BlankSplitChar)) {
                        self._pauseSearch();
                    }
                    break;
            }
        });
    },

    _assertPopupView: function () {
        var self = this, o = this.options;
        if ((o.masker && !BI.Maskers.has(this.getName())) || (o.masker === false && !this.popupView)) {
            this.popupView = BI.createWidget(o.popup, {
                type: "bi.searcher_view",
                chooseType: o.chooseType
            });
            this.popupView.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                if (type === BI.Events.CLICK) {
                    if (o.isAutoSync) {
                        var values = o.adapter && o.adapter.getValue();
                        switch (o.chooseType) {
                            case BI.ButtonGroup.CHOOSE_TYPE_SINGLE:
                                o.adapter && o.adapter.setValue([obj.getValue()]);
                                break;
                            case BI.ButtonGroup.CHOOSE_TYPE_MULTI:
                                if (!obj.isSelected()) {
                                    o.adapter && o.adapter.setValue(BI.deepWithout(values, obj.getValue()));
                                }
                                values.push(obj.getValue());
                                o.adapter && o.adapter.setValue(values);
                                break;
                        }
                    }
                    self.fireEvent(BI.Searcher.EVENT_CHANGE, value, obj);
                }
            });
            BI.nextTick(function () {
                self.fireEvent(BI.Searcher.EVENT_AFTER_INIT);
            });
        }
        if (o.masker && !BI.Maskers.has(this.getName())) {
            BI.Maskers.create(this.getName(), o.adapter, BI.extend({
                container: this,
                render: this.popupView
            }, o.masker), this);
        }
    },

    _startSearch: function () {
        this._assertPopupView();
        this._stop = false;
        this._isSearching = true;
        this.fireEvent(BI.Searcher.EVENT_START);
        this.popupView.startSearch && this.popupView.startSearch();
        // 搜索前先清空dom
        // BI.Maskers.get(this.getName()).empty();
        BI.nextTick(function (name) {
            BI.Maskers.show(name);
        }, this.getName());
    },

    _pauseSearch: function () {
        var o = this.options, name = this.getName();
        this._stop = true;
        BI.nextTick(function (name) {
            BI.Maskers.hide(name);
        }, this.getName());
        if (this._isSearching === true) {
            this.popupView && this.popupView.pauseSearch && this.popupView.pauseSearch();
            this.fireEvent(BI.Searcher.EVENT_PAUSE);
        }
        this._isSearching = false;
    },

    _stopSearch: function () {
        var o = this.options, name = this.getName();
        this._stop = true;
        BI.Maskers.hide(name);
        if (this._isSearching === true) {
            this.popupView && this.popupView.stopSearch && this.popupView.stopSearch();
            this.fireEvent(BI.Searcher.EVENT_STOP);
        }
        this._isSearching = false;
    },

    _search: function () {
        var self = this, o = this.options, keyword = this.editor.getValue();
        if (keyword === "" || this._stop) {
            return;
        }
        if (o.isAutoSearch) {
            var items = (o.adapter && ((o.adapter.getItems && o.adapter.getItems()) || o.adapter.attr("items"))) || [];
            var finding = BI.Func.getSearchResult(items, keyword);
            var match = finding.match, find = finding.find;
            this.popupView.populate(find, match, keyword);
            o.isAutoSync && o.adapter && o.adapter.getValue && this.popupView.setValue(o.adapter.getValue());
            self.fireEvent(BI.Searcher.EVENT_SEARCHING);
            return;
        }
        this.popupView.loading && this.popupView.loading();
        o.onSearch({
            times: 1,
            keyword: keyword,
            selectedValues: o.adapter && o.adapter.getValue()
        }, function (searchResult, matchResult) {
            if (!self._stop) {
                var args = [].slice.call(arguments);
                if (args.length > 0) {
                    args.push(keyword);
                }
                BI.Maskers.show(self.getName());
                self.popupView.populate.apply(self.popupView, args);
                o.isAutoSync && o.adapter && o.adapter.getValue && self.popupView.setValue(o.adapter.getValue());
                self.popupView.loaded && self.popupView.loaded();
                self.fireEvent(BI.Searcher.EVENT_SEARCHING);
            }
        });
    },

    _getLastSearchKeyword: function () {
        if (this.isValid()) {
            var res = this.editor.getValue().split(/\u200b\s\u200b/);
            if (BI.isEmptyString(res[res.length - 1])) {
                res = res.slice(0, res.length - 1);
            }
            return BI.isNull(res) ? "" : res[res.length - 1];
        }
    },

    setAdapter: function (adapter) {
        this.options.adapter = adapter;
        BI.Maskers.remove(this.getName());
    },

    doSearch: function () {
        if (this.isSearching()) {
            this._search();
        }
    },

    stopSearch: function () {
        this._stopSearch();// 先停止搜索，然后再去设置editor为空
        // important:停止搜索必须退出编辑状态,这里必须加上try(input框不显示时blur会抛异常)
        try {
            this.editor.blur();
        } catch (e) {
            if (!this.editor.blur) {
                throw new Error("editor没有实现blur方法");
            }
        } finally {
            this.editor.setValue("");
        }
    },

    isSearching: function () {
        return this._isSearching;
    },

    isViewVisible: function () {
        return this.editor.isEnabled() && BI.Maskers.isVisible(this.getName());
    },

    getView: function () {
        return this.popupView;
    },

    hasMatched: function () {
        this._assertPopupView();
        return this.popupView.hasMatched();
    },

    adjustHeight: function () {
        if (BI.Maskers.has(this.getName()) && BI.Maskers.get(this.getName()).isVisible()) {
            BI.Maskers.show(this.getName());
        }
    },

    adjustView: function () {
        this.isViewVisible() && BI.Maskers.show(this.getName());
    },

    setValue: function (v) {
        if (BI.isNull(this.popupView)) {
            this.options.popup.value = v;
        } else {
            this.popupView.setValue(v);
        }
    },

    getKeyword: function () {
        return this._getLastSearchKeyword();
    },

    getKeywords: function () {
        return this.editor.getKeywords();
    },

    getValue: function () {
        var o = this.options;
        if (o.isAutoSync && o.adapter && o.adapter.getValue) {
            return o.adapter.getValue();
        }
        if (this.isSearching()) {
            return this.popupView.getValue();
        } else if (o.adapter && o.adapter.getValue) {
            return o.adapter.getValue();
        }
        if (BI.isNull(this.popupView)) {
            return o.popup.value;
        }
        return this.popupView.getValue();

    },

    populate: function (result, searchResult, keyword) {
        var o = this.options;
        this._assertPopupView();
        this.popupView.populate.apply(this.popupView, arguments);
        if (o.isAutoSync && o.adapter && o.adapter.getValue) {
            this.popupView.setValue(o.adapter.getValue());
        }
    },

    empty: function () {
        this.popupView && this.popupView.empty();
    },

    destroyed: function () {
        BI.Maskers.remove(this.getName());
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setWaterMark: function (v) {
        this.editor.setWaterMark(v);
    }
});
BI.Searcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.Searcher.EVENT_START = "EVENT_START";
BI.Searcher.EVENT_STOP = "EVENT_STOP";
BI.Searcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.Searcher.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.Searcher.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";

BI.shortcut("bi.searcher", BI.Searcher);
