/**
 * 完成搜索功能模块
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SelectDataSearcher
 * @extends BI.Widget
 */
BI.SelectDataSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectDataSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-searcher",
            packages: [],
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.SelectDataSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.packagePane = BI.createWidget({
            type: "bi.select_data_switcher",
            packages: o.packages,
            itemsCreator: function (op) {
                op.packageId = self.getPackageId();
                if (!op.packageId) {
                    return;
                }
                o.itemsCreator.apply(self, arguments);
            }
        });
        this.packagePane.on(BI.SelectDataSwitcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearcher.EVENT_CLICK_PACKAGE, arguments);
        });
        this.packagePane.on(BI.SelectDataSwitcher.EVENT_CLICK_ITEM, function () {
            self.fireEvent(BI.SelectDataSearcher.EVENT_CLICK_ITEM, arguments);
        });

        this.searcherPane = BI.createWidget({
            type: "bi.select_data_search_result_pane",
            itemsCreator: function (op) {
                op.packageId = self.getPackageId();
                if (!op.packageId) {
                    return;
                }
                o.itemsCreator.apply(self, arguments);
            }
        });
        this.searcherPane.on(BI.SelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE, function () {
            self.searcher.doSearch();
        });
        this.searcherPane.on(BI.SelectDataSearchResultPane.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearcher.EVENT_CLICK_ITEM, arguments);
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
                    packageId: self.getPackageId(),
                    searchType: self.searcherPane.getSegmentValue()
                }), function (searchResult, matchResult) {
                    populate(searchResult, matchResult, op.keyword);
                })
            },
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
            popup: this.searcherPane,
            adapter: this.packagePane
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
            }, this.packagePane]
        })
    },

    setEnable: function (v) {
        BI.SelectDataSearcher.superclass.setEnable.apply(this, arguments);
        this.packagePane.setEnable(v)
    },

    setPackage: function (pId) {
        this.packagePane.setPackage(pId);
    },

    getPackageId: function () {
        return this.packagePane.getPackageId();
    },

    setValue: function (v) {

    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populatePackages: function (packages) {
        this.options.packages = packages;
        this.packagePane.populatePackages(packages);
        this.searcher.stopSearch();
        this.populate();
    },

    populate: function () {
        this.packagePane.populate.apply(this.packagePane, arguments);
    }
});
BI.SelectDataSearcher.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
BI.SelectDataSearcher.EVENT_CLICK_PACKAGE = "EVENT_CLICK_PACKAGE";
$.shortcut('bi.select_data_searcher', BI.SelectDataSearcher);