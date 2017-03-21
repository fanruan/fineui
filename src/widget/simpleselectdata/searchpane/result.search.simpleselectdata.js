/**
 * 搜索结果面板
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SimpleSelectDataSearchResultPane
 * @extends BI.Widget
 */
BI.SimpleSelectDataSearchResultPane = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SimpleSelectDataSearchResultPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-data-search-result-pane bi-select-data-search-result-pane bi-searcher-view",
            itemsCreator: BI.emptyFn,
            segment: {}
        });
    },

    _init: function () {
        BI.SimpleSelectDataSearchResultPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.segment = BI.createWidget(o.segment, {
            type: "bi.simple_select_data_search_segment",
            cls: "search-result-toolbar"
        });
        this.segment.on(BI.SimpleSelectDataSearchSegment.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleSelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE);
        });

        this.resultPane = BI.createWidget({
            type: "bi.searcher_view",
            matcher: {
                type: "bi.select_data_tree",
                el: {
                    el: {
                        chooseType: BI.Selection.Single
                    }
                },
                itemsCreator: o.itemsCreator
            },
            searcher: {
                type: "bi.select_data_tree",
                el: {
                    el: {
                        chooseType: BI.Selection.Single
                    }
                },
                itemsCreator: o.itemsCreator
            }
        });

        this.resultPane.on(BI.SearcherView.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleSelectDataSearchResultPane.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.segment,
                height: 30
            }, {
                type: "bi.border",
                cls: "search-result-line",
                height: 2
            }, {
                type: "bi.border",
                cls: "search-result-line",
                height: 1
            }, {
                type: "bi.absolute",
                items: [{
                    el: this.resultPane,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            }]
        });
    },

    empty: function () {
        this.resultPane.empty();
    },

    populate: function (searchResult, matchResult, keyword) {
        this.resultPane.populate.apply(this.resultPane, arguments);
    },

    setValue: function (v) {

    },

    getSegmentValue: function () {
        return this.segment.getValue();
    },

    getValue: function () {
        return this.resultPane.getValue();
    }
});
BI.SimpleSelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE = "EVENT_SEARCH_TYPE_CHANGE";
BI.SimpleSelectDataSearchResultPane.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.simple_select_data_search_result_pane', BI.SimpleSelectDataSearchResultPane);