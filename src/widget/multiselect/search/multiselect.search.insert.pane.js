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
            keywordGetter: BI.emptyFn,
            itemHeight: 24
        });
    },

    _init: function () {
        BI.MultiSelectSearchInsertPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.addNotMatchTip = BI.createWidget({
            type: "bi.label",
            text: BI.i18nText("BI-Basic_Press_Enter_To_Add_Text", ""),
            height: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            cls: "bi-keyword-red-mark",
            hgap: 5,
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
            itemHeight: o.itemHeight,
            value: o.value
        });
        this.loader.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.resizer = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.addNotMatchTip,
                height: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            }, {
                el: this.loader,
            }],
        });
    },

    setKeyword: function (keyword) {
        this.addNotMatchTip.setText(BI.i18nText("BI-Basic_Press_Enter_To_Add_Text", keyword));
    },

    isAllSelected: function () {
        return this.loader.isAllSelected();
    },

    hasMatched: function () {
        return false;
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

BI.shortcut("bi.multi_select_search_insert_pane", BI.MultiSelectSearchInsertPane);