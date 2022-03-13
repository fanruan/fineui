/**
 * guy
 *
 * Created by GUY on 2015/9/9.
 * @class BI.IconTextItem
 * @extends BI.BasicButton
 */
BI.IconTextItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.IconTextItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-icon-text-item",
            direction: BI.Direction.Left,
            logic: {
                dynamic: false
            },
            iconWrapperWidth: null,
            iconHeight: null,
            iconWidth: null,
            iconCls: "",
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },

    render: function () {
        var self = this, o = this.options;

        return {
            type: "bi.vertical_adapt",
            columnSize: [o.iconWrapperWidth || o.height, "fill"],
            items: [{
                type: "bi.icon_label",
                cls: o.iconCls,
                width: o.iconWrapperWidth || o.height,
                height: o.height,
                iconWidth: o.iconWidth,
                iconHeight: o.iconHeight
            }, {
                el: {
                    type: "bi.label",
                    ref: function (_ref) {
                        self.text = _ref;
                    },
                    cls: "list-item-text",
                    textAlign: "left",
                    hgap: o.textHgap,
                    vgap: o.textVgap,
                    lgap: o.textLgap,
                    rgap: o.textRgap,
                    text: o.text,
                    value: o.value,
                    keyword: o.keyword,
                    height: o.height
                }
            }]
        };
    },

    doClick: function () {
        BI.IconTextItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.IconTextItem.EVENT_CHANGE, this.getValue(), this);
        }
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    }
});
BI.IconTextItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_text_item", BI.IconTextItem);
