/**
 * 完成搜索功能模块
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SimpleSelectDataSearcher
 * @extends BI.Widget
 */
BI.SimpleSelectDataSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SimpleSelectDataSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-simple-select-data-searcher",
            items: [],
            itemsCreator: BI.emptyFn,
            popup: {},
            adapter: {}
        });
    },

    _init: function () {
        BI.SimpleSelectDataSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;

        this.tree = BI.createWidget(o.adapter, {
            type: "bi.select_data_tree",
            items: o.items,
            el: {
                el: {
                    chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
                }
            },
            itemsCreator: o.itemsCreator
        });
        this.tree.on(BI.SelectDataTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleSelectDataSearcher.EVENT_CLICK_ITEM, arguments);
        });

        this.searcherPane = BI.createWidget(o.popup, {
            type: "bi.simple_select_data_search_result_pane",
            itemsCreator: o.itemsCreator
        });
        this.searcherPane.on(BI.SimpleSelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE, function () {
            self.searcher.doSearch();
        });
        this.searcherPane.on(BI.SimpleSelectDataSearchResultPane.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleSelectDataSearcher.EVENT_CLICK_ITEM, arguments);
        });


        this.searcher = BI.createWidget({
            type: "bi.searcher",
            el: {
                type: "bi.small_search_editor"
            },
            isAutoSearch: false, //是否自动搜索
            isAutoSync: false,
            onSearch: function (op, populate) {
                o.itemsCreator(BI.extend(op, {
                    searchType: self.searcherPane.getSegmentValue()
                }), function (searchResult, matchResult) {
                    populate(searchResult, matchResult, op.keyword);
                })
            },
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            popup: this.searcherPane,
            adapter: this.tree
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: this.searcher,
                        left: 10,
                        right: 10,
                        top: 10
                    }]
                },
                height: 45
            }, this.tree]
        })
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    setValue: function (v) {

    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populate: function () {
        this.tree.populate.apply(this.tree, arguments);
    }
});
BI.SimpleSelectDataSearcher.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
$.shortcut('bi.simple_select_data_searcher', BI.SimpleSelectDataSearcher);