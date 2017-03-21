/**
 * 文本标签
 *
 * Created by fay on 2016/9/11.
 */
BI.TextLabel = BI.inherit(BI.Widget, {

    _constant: {
        MAX_COLUMN_SIZE: 40
    },

    _defaultConfig: function () {
        return BI.extend(BI.TextLabel.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-label",
            title: ""
        })
    },

    _init: function () {
        BI.TextLabel.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var title = BI.createWidget({
            type: "bi.label",
            text: o.title + ":"
        });
        this.container = BI.createWidget({
            type: "bi.text_label_item_group",
            items: BI.createItems(o.items.slice(0, this._constant.MAX_COLUMN_SIZE), {
                type: "bi.text_button"
            }),
            layouts: [{
                type: "bi.horizontal",

            }]
        });

        BI.createWidget({
            type: "bi.horizontal",
            items: [title, this.container],
            element: this
        })
    },
    
    setValue: function (v) {
        this.container.setValue(v);
    },
    
    getValue: function () {
        return this.container.getValue();
    }
});

$.shortcut('bi.text_label', BI.TextLabel);