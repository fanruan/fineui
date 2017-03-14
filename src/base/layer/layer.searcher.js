/**
 * 搜索面板
 *
 * Created by GUY on 2015/9/28.
 * @class BI.SearcherView
 * @extends BI.Pane
 */

BI.SearcherView = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        var conf = BI.SearcherView.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-searcher-view",
            tipText: BI.i18nText("BI-No_Select"),
            chooseType: BI.Selection.Single,

            matcher: {//完全匹配的构造器
                type: "bi.button_group",
                behaviors: {
                    redmark: function () {
                        return true;
                    }
                },
                items: [],
                layouts: [{
                    type: "bi.vertical"
                }]
            },
            searcher: {
                type: "bi.button_group",
                behaviors: {
                    redmark: function () {
                        return true;
                    }
                },
                items: [],
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        })
    },

    _init: function () {
        BI.SearcherView.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.matcher = BI.createWidget(o.matcher, {
            type: "bi.button_group",
            chooseType: o.chooseType,
            behaviors: {
                redmark: function () {
                    return true;
                }
            },
            layouts: [{
                type: "bi.vertical"
            }]
        });
        this.matcher.on(BI.Controller.EVENT_CHANGE, function (type, val, ob) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.SearcherView.EVENT_CHANGE, val, ob);
            }
        });
        this.spliter = BI.createWidget({
            type: "bi.vertical",
            height: 1,
            hgap: 10,
            items: [{
                type: "bi.layout",
                height: 1,
                cls: "searcher-view-spliter"
            }]
        });
        this.searcher = BI.createWidget(o.searcher, {
            type: "bi.button_group",
            chooseType: o.chooseType,
            behaviors: {
                redmark: function () {
                    return true;
                }
            },
            layouts: [{
                type: "bi.vertical"
            }]
        });
        this.searcher.on(BI.Controller.EVENT_CHANGE, function (type, val, ob) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.SearcherView.EVENT_CHANGE, val, ob);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this.element,
            items: [this.matcher, this.spliter, this.searcher]
        });
    },

    startSearch: function () {

    },

    stopSearch: function () {

    },

    setValue: function (v) {
        this.matcher.setValue(v);
        this.searcher.setValue(v);
    },

    getValue: function () {
        return this.matcher.getValue().concat(this.searcher.getValue());
    },

    populate: function (searchResult, matchResult, keyword) {
        searchResult || (searchResult = []);
        matchResult || (matchResult = []);
        this.setTipVisible(searchResult.length + matchResult.length === 0);
        this.spliter.setVisible(BI.isNotEmptyArray(matchResult) && BI.isNotEmptyArray(searchResult));
        this.matcher.populate(matchResult, keyword);
        this.searcher.populate(searchResult, keyword);
    },

    empty: function () {
        this.searcher.empty();
        this.matcher.empty();
    },

    hasMatched: function () {
        return this.matcher.getAllButtons().length > 0;
    }
});
BI.SearcherView.EVENT_CHANGE = "EVENT_CHANGE";

$.shortcut("bi.searcher_view", BI.SearcherView);