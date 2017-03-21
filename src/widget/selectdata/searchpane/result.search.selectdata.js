/**
 * 搜索结果面板
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SelectDataSearchResultPane
 * @extends BI.Widget
 */
BI.SelectDataSearchResultPane = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataSearchResultPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-search-result-pane bi-searcher-view",
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.SelectDataSearchResultPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.segment = BI.createWidget({
            type: "bi.select_data_search_segment",
            cls: "search-result-toolbar"
        });
        this.segment.on(BI.SelectDataSearchSegment.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE);
        });

        this.resultPane = BI.createWidget({
            type: "bi.searcher_view",
            matcher: {
                type: "bi.select_data_tree",
                itemsCreator: o.itemsCreator
            },
            searcher: {
                type: "bi.select_data_tree",
                itemsCreator: o.itemsCreator
            }
        });
        this.resultPane.on(BI.SearcherView.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearchResultPane.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.segment,
                height: 60
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

    startSearch: function () {

    },

    stopSearch: function () {

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
BI.SelectDataSearchResultPane.EVENT_CHANGE = "EVENT_CHANGE";
BI.SelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE = "EVENT_SEARCH_TYPE_CHANGE";
$.shortcut('bi.select_data_search_result_pane', BI.SelectDataSearchResultPane);