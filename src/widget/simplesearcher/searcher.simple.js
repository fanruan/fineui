/**
 * 简单的搜索功能
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SimpleSearcher
 * @extends BI.Widget
 */
BI.SimpleSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SimpleSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-simple-searcher",
            items: [],
            itemsCreator: BI.emptyFn,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.SimpleSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;

        this.tree = BI.createWidget({
            type: "bi.select_data_tree",
            items: o.items,
            el: {
                el: {
                    chooseType: o.chooseType
                }
            },
            itemsCreator: o.itemsCreator
        });
        this.tree.on(BI.SelectDataTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleSearcher.EVENT_CHANGE, arguments);
        });

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            el: {
                type: "bi.small_search_editor"
            },
            isAutoSearch: false, //是否自动搜索
            isAutoSync: false,
            onSearch: function (op, populate) {
                o.itemsCreator(op, function (searchResult, matchResult) {
                    populate(searchResult, matchResult, op.keyword);
                })
            },
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            popup: {
                matcher: {
                    type: "bi.select_data_tree",
                    el: {
                        el: {
                            chooseType: o.chooseType
                        }
                    },
                    itemsCreator: o.itemsCreator
                },
                searcher: {
                    type: "bi.select_data_tree",
                    el: {
                        el: {
                            chooseType: o.chooseType
                        }
                    },
                    itemsCreator: o.itemsCreator
                }
            },
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
BI.SimpleSearcher.EVENT_CHANGE = "SimpleSearcher.EVENT_CHANGE";
$.shortcut('bi.simple_searcher', BI.SimpleSearcher);