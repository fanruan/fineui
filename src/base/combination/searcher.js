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
            isAutoSearch: true, //是否自动搜索
            isAutoSync: true, //是否自动同步数据, 即是否保持搜索面板和adapter面板状态值的统一
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,

            //isAutoSearch为false时启用
            onSearch: function (op, callback) {
                callback([])
            },


            el: {
                type: "bi.search_editor"
            },

            popup: {
                type: "bi.searcher_view"
            },

            adapter: null,
            masker: { //masker层
                offset: {}
            }
        })
    },

    _init: function () {
        BI.Searcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.editor = BI.createWidget(o.el, {
            type: "bi.search_editor"
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this.element,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            vgap: o.vgap,
            hgap: o.hgap,
            items: [this.editor]
        });
        o.isDefaultInit && (this._assertPopupView());

        var search = BI.debounce(BI.bind(this._search, this), BI.EVENT_RESPONSE_TIME, true);
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
                    self._pauseSearch();
                    break;
            }
        })
    },

    _assertPopupView: function () {
        var self = this, o = this.options;
        if (!BI.Maskers.has(this.getName())) {
            this.popupView = BI.createWidget(o.popup, {
                type: "bi.searcher_view",
                chooseType: o.chooseType
            });
            BI.Maskers.create(this.getName(), o.adapter, {
                offset: o.masker.offset,
                container: this,
                render: this.popupView
            });

            this.popupView.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                if (type === BI.Events.CLICK) {
                    if (o.isAutoSync) {
                        var values = o.adapter.getValue();
                        if (!obj.isSelected()) {
                            o.adapter.setValue(BI.deepWithout(values, obj.getValue()));
                        } else {
                            switch (o.chooseType) {
                                case BI.ButtonGroup.CHOOSE_TYPE_SINGLE:
                                    o.adapter.setValue([obj.getValue()]);
                                    break;
                                case BI.ButtonGroup.CHOOSE_TYPE_MULTI:
                                    values.push(obj.getValue());
                                    o.adapter.setValue(values);
                                    break;
                            }
                        }
                    }
                    self.fireEvent(BI.Searcher.EVENT_CHANGE, value, obj);
                }
            });
            BI.nextTick(function () {
                self.fireEvent(BI.Searcher.EVENT_AFTER_INIT);
            });
        }
    },

    _startSearch: function () {
        this._assertPopupView();
        this._stop = false;
        this._isSearching = true;
        this.fireEvent(BI.Searcher.EVENT_START);
        this.popupView.startSearch && this.popupView.startSearch();
        //搜索前先清空dom
        BI.Maskers.get(this.getName()).empty();
        BI.nextTick(function (name) {
            BI.Maskers.show(name);
        }, this.getName());
    },

    _pauseSearch: function () {
        var o = this.options, name = this.getName();
        this._stop = true;
        BI.Maskers.hide(name);
        if (BI.Maskers.has(name) && this._isSearching === true) {
            this.popupView && this.popupView.pauseSearch && this.popupView.pauseSearch();
            this.fireEvent(BI.Searcher.EVENT_PAUSE);
        }
        this._isSearching = false;
    },

    _stopSearch: function () {
        var o = this.options, name = this.getName();
        this._stop = true;
        BI.Maskers.hide(name);
        if (BI.Maskers.has(name) && this._isSearching === true) {
            //搜索后清空dom
            BI.nextTick(function () {
                BI.Maskers.has(name) && BI.Maskers.get(name).empty();
            });
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
            var items = (o.adapter.getItems && o.adapter.getItems()) || o.adapter.attr("items") || [];
            var finding = BI.Func.getSearchResult(items, keyword);
            var matched = finding.matched, finded = finding.finded;
            this.popupView.populate(finded, matched, keyword);
            o.isAutoSync && this.popupView.setValue(o.adapter.getValue());
            self.fireEvent(BI.Searcher.EVENT_SEARCHING);
            return;
        }
        this.popupView.loading && this.popupView.loading();
        o.onSearch({
            times: 1,
            keyword: keyword,
            selectedValues: o.adapter.getValue()
        }, function (searchResult, matchResult) {
            if (!self._stop) {
                var args = [].slice.call(arguments);
                if (args.length > 0) {
                    args.push(keyword);
                }
                BI.Maskers.show(self.getName());
                self.popupView.populate.apply(self.popupView, args);
                o.isAutoSync && self.popupView.setValue(o.adapter.getValue());
                self.popupView.loaded && self.popupView.loaded();
                self.fireEvent(BI.Searcher.EVENT_SEARCHING);
            }
        });
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
        this._stopSearch();//先停止搜索，然后再去设置editor为空
        //important:停止搜索必须退出编辑状态,这里必须加上try(input框不显示时blur会抛异常)
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
        this._assertPopupView();
        this.popupView && this.popupView.setValue(v);
    },

    getKeyword: function () {
        return this.editor.getValue();
    },

    getValue: function () {
        var o = this.options;
        if (o.isAutoSync) {
            return o.adapter.getValue();
        }
        if (this.isSearching()) {
            return this.popupView.getValue();
        } else {
            return o.adapter.getValue();
        }
    },

    populate: function (result, searchResult, keyword) {
        var o = this.options;
        this._assertPopupView();
        this.popupView.populate.apply(this.popupView, arguments);
        if (o.isAutoSync) {
            this.popupView.setValue(o.adapter.getValue());
        }
    },

    empty: function () {
        this.popupView && this.popupView.empty();
    },

    destroy: function () {
        BI.Maskers.remove(this.getName());
        BI.Searcher.superclass.destroy.apply(this, arguments);
    }
});
BI.Searcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.Searcher.EVENT_START = "EVENT_START";
BI.Searcher.EVENT_STOP = "EVENT_STOP";
BI.Searcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.Searcher.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.Searcher.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";

$.shortcut("bi.searcher", BI.Searcher);