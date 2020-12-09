/**
 * 文字trigger(右边小三角小一号的) ==
 *
 * @class BI.SmallTextTrigger
 * @extends BI.Trigger
 */
BI.SmallTextTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 6
    },

    _defaultConfig: function () {
        var conf = BI.SmallTextTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-trigger",
            height: 20
        });
    },

    _init: function () {
        BI.SmallTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            height: o.height,
            text: o.text,
            hgap: c.hgap
        });
        this.trigerButton = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.triggerWidth || o.height
        });

        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: this.text
                }, {
                    el: this.trigerButton,
                    width: o.triggerWidth || o.height
                }
            ]
        });
    },

    setValue: function (value) {
        this.text.setValue(value);
    },

    setText: function (text) {
        this.text.setText(text);
    }
});
BI.shortcut("bi.small_text_trigger", BI.SmallTextTrigger);