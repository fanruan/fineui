/**
 * Created by roy on 16/1/21.
 */
BI.FunctionSearcherPane = BI.inherit(BI.SearcherView, {
    _defaultConfig: function () {
        var conf = BI.FunctionSearcherPane.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-function-searcher-pane"
        })
    },

    _init: function () {
        BI.FunctionSearcherPane.superclass._init.apply(this, arguments);
    },

    populate: function (searchResult, keyword) {
        searchResult || (searchResult = []);
        this.spliter.setVisible(false);
        this.searcher.populate(searchResult, keyword);
        this.searcher.expandAll();
        this.searcher.doBehavior(keyword);
    },


});
$.shortcut("bi.function_searcher_pane", BI.FunctionSearcherPane);