/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.MultiSelectSearchPane
 * @extends Widget
 */

BI.MultiSelectSearchPane = BI.inherit(BI.Widget, {

    constants: {
        height: 24,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectSearchPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-search-pane bi-card",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            keywordGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectSearchPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.tooltipClick = BI.createWidget({
            type: "bi.label",
            invisible: true,
            text: BI.i18nText("BI-Click_Blank_To_Select"),
            cls: "multi-select-toolbar",
            height: this.constants.height
        });

        this.loader = BI.createWidget({
            type: "bi.multi_select_search_loader",
            keywordGetter: o.keywordGetter,
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator.apply(self, [op, function (res) {
                    callback(res);
                    self.setKeyword(o.keywordGetter());
                }]);
            },
            value: o.value
        });
        this.loader.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.resizer = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.tooltipClick,
                height: 0
            }, {
                el: this.loader
            }]
        });
        this.tooltipClick.setVisible(false);
    },

    setKeyword: function (keyword) {
        var btn, o = this.options;
        var isVisible = this.loader.getAllButtons().length > 0 && (btn = this.loader.getAllButtons()[0]) && keyword === btn.getValue();
        if (isVisible !== this.tooltipClick.isVisible()) {
            this.tooltipClick.setVisible(isVisible);
            this.resizer.attr("items")[0].height = (isVisible ? this.constants.height : 0);
            this.resizer.resize();
        }
    },

    isAllSelected: function () {
        return this.loader.isAllSelected();
    },

    hasMatched: function () {
        return this.tooltipClick.isVisible();
    },

    setValue: function (v) {
        this.loader.setValue(v);
    },

    getValue: function () {
        return this.loader.getValue();
    },

    empty: function () {
        this.loader.empty();
    },

    populate: function (items) {
        this.loader.populate.apply(this.loader, arguments);
    }
});

BI.MultiSelectSearchPane.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.multi_select_search_pane", BI.MultiSelectSearchPane);