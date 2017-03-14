/**
 * 文字trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.TextTrigger
 * @extends BI.Trigger
 */
BI.TextTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        triggerWidth: 30
    },

    _defaultConfig: function () {
        var conf = BI.TextTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-trigger",
            height: 30
        });
    },

    _init: function () {
        BI.TextTrigger.superclass._init.apply(this, arguments);
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
            width: c.triggerWidth
        });

        BI.createWidget({
            element: this.element,
            type: 'bi.htape',
            items: [
                {
                    el: this.text
                }, {
                    el: this.trigerButton,
                    width: c.triggerWidth
                }
            ]
        });
    },

    setEnable: function (v) {
        BI.TextTrigger.superclass.setEnable.apply(this, arguments);
        this.trigerButton.setEnable(v);
        this.text.setEnable(v);
    },

    setValue: function (value) {
        this.text.setValue(value);
    },

    setText: function (text) {
        this.text.setText(text);
    }
});
$.shortcut("bi.text_trigger", BI.TextTrigger);