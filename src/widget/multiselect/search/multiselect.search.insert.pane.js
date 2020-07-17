/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.MultiSelectSearchInsertPane
 * @extends Widget
 */

BI.MultiSelectSearchInsertPane = BI.inherit(BI.Widget, {

    constants: {
        height: 24,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectSearchInsertPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-search-pane bi-card",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            keywordGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectSearchInsertPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.tooltipClick = BI.createWidget({
            type: "bi.label",
            invisible: true,
            text: BI.i18nText("BI-Click_Blank_To_Select"),
            cls: "multi-select-toolbar",
            height: this.constants.height
        });

        this.addNotMatchTip = BI.createWidget({
            type: "bi.text_button",
            invisible: true,
            text: BI.i18nText("BI-Basic_Click_To_Add_Text", ""),
            height: this.constants.height,
            cls: "bi-high-light",
            hgap: 5,
            handler: function () {
                self.fireEvent(BI.MultiSelectSearchInsertPane.EVENT_ADD_ITEM, o.keywordGetter());
            }
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
                type: "bi.vertical",
                items: [this.tooltipClick, this.addNotMatchTip],
                height: this.constants.height
            }, {
                el: this.loader
            }]
        });
    },

    setKeyword: function (keyword) {
        var o = this.options;
        var hasSameValue = BI.some(this.loader.getAllButtons(), function (idx, btn) {
            return keyword === btn.getValue();
        });
        var isMatchTipVisible = this.loader.getAllButtons().length > 0 && hasSameValue;
        this.tooltipClick.setVisible(isMatchTipVisible);
        this.addNotMatchTip.setVisible(!isMatchTipVisible);
        !isMatchTipVisible && this.addNotMatchTip.setText(BI.i18nText("BI-Basic_Click_To_Add_Text", keyword));
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

BI.MultiSelectSearchInsertPane.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiSelectSearchInsertPane.EVENT_ADD_ITEM = "EVENT_ADD_ITEM";

BI.shortcut("bi.multi_select_search_insert_pane", BI.MultiSelectSearchInsertPane);