/**
 *
 * @class BI.MultiSelectCheckPane
 * @extends BI.Widget
 */
BI.MultiSelectCheckPane = BI.inherit(BI.Widget, {

    constants: {
        height: 12,
        lgap: 10,
        tgap: 10,
        bgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCheckPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-check-pane bi-background",
            items: [],
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            onClickContinueSelect: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectCheckPane.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.storeValue = opts.value || {};
        this.display = BI.createWidget({
            type: "bi.display_selected_list",
            items: opts.items,
            itemsCreator: function (op, callback) {
                op = BI.extend(op || {}, {
                    selectedValues: self.storeValue.value
                });
                if (self.storeValue.type === BI.Selection.Multi) {
                    callback({
                        items: BI.map(self.storeValue.value, function (i, v) {
                            var txt = opts.valueFormatter(v) || v;

                            return {
                                text: txt,
                                value: v,
                                title: txt
                            };
                        })
                    });

                    return;
                }
                opts.itemsCreator(op, callback);
            }
        });

        this.continueSelect = BI.createWidget({
            type: "bi.text_button",
            title: BI.i18nText("BI-Continue_Select"),
            text: BI.i18nText("BI-Continue_Select"),
            cls: "multi-select-check-selected bi-high-light"
        });

        this.continueSelect.on(BI.TextButton.EVENT_CHANGE, function () {
            opts.onClickContinueSelect();
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                height: this.constants.height,
                el: {
                    type: "bi.vertical_adapt",
                    columnSize: ["auto", "auto"],
                    cls: "multi-select-continue-select",
                    items: [
                        {
                            el: {
                                type: "bi.label",
                                title: BI.i18nText("BI-Selected_Data"),
                                text: BI.i18nText("BI-Selected_Data")
                            },
                            lgap: this.constants.lgap
                        },
                        {
                            el: this.continueSelect,
                            hgap: this.constants.lgap
                        }]
                },
                tgap: this.constants.tgap
            }, {
                height: "fill",
                el: this.display,
                tgap: this.constants.bgap
            }]
        });
    },

    setValue: function (v) {
        this.storeValue = v || {};
    },

    empty: function () {
        this.display.empty();
    },

    populate: function () {
        this.display.populate.apply(this.display, arguments);
    }
});

BI.shortcut("bi.multi_select_check_pane", BI.MultiSelectCheckPane);
