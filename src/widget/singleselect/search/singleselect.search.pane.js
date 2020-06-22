/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.SingleSelectSearchPane
 * @extends Widget
 */

BI.SingleSelectSearchPane = BI.inherit(BI.Widget, {

    constants: {
        height: 25,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectSearchPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-search-pane bi-card",
            allowNoSelect: false,
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            keywordGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.SingleSelectSearchPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.tooltipClick = BI.createWidget({
            type: "bi.label",
            invisible: true,
            text: BI.i18nText("BI-Click_Blank_To_Select"),
            cls: "single-select-toolbar",
            height: this.constants.height
        });

        this.loader = BI.createWidget({
            type: "bi.single_select_search_loader",
            allowNoSelect: o.allowNoSelect,
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
        var isVisible = this.loader.getAllButtons().length > 0 && (btn = this.loader.getAllButtons()[0]) && (keyword === (o.valueFormatter(btn.getValue()) || btn.getValue()));
        if (isVisible !== this.tooltipClick.isVisible()) {
            this.tooltipClick.setVisible(isVisible);
            this.resizer.attr("items")[0].height = (isVisible ? this.constants.height : 0);
            this.resizer.resize();
        }
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

BI.SingleSelectSearchPane.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.single_select_search_pane", BI.SingleSelectSearchPane);