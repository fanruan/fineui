/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.SingleSelectSearchInsertPane
 * @extends Widget
 */

BI.SingleSelectSearchInsertPane = BI.inherit(BI.Widget, {

    constants: {
        height: 25,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectSearchInsertPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-search-pane bi-card",
            allowNoSelect: false,
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            keywordGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.SingleSelectSearchInsertPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.addNotMatchTip = BI.createWidget({
            type: "bi.label",
            text: BI.i18nText("BI-Basic_Press_Enter_To_Add_Text", ""),
            height: this.constants.height,
            cls: "bi-keyword-red-mark",
            hgap: 5,
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
                type: "bi.vertical",
                items: [this.addNotMatchTip],
                height: this.constants.height
            }, {
                el: this.loader
            }]
        });
    },

    setKeyword: function (keyword) {
        this.addNotMatchTip.setText(BI.i18nText("BI-Basic_Press_Enter_To_Add_Text", keyword));
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

BI.SingleSelectSearchInsertPane.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.single_select_search_insert_pane", BI.SingleSelectSearchInsertPane);