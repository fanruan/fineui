/**
 * 文字trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.TextTrigger
 * @extends BI.Trigger
 */
BI.TextTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 6
    },

    _defaultConfig: function () {
        var conf = BI.TextTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-trigger",
            height: 24,
            textCls: ""
        });
    },

    _init: function () {
        BI.TextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "select-text-label" + (BI.isKey(o.textCls) ? (" " + o.textCls) : ""),
            textAlign: "left",
            height: o.height,
            text: o.text,
            title: function () {
                return self.text.getText();
            },
            tipType: o.tipType,
            warningTitle: o.warningTitle,
            hgap: c.hgap,
            readonly: o.readonly
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

    getTextor: function() {
        return this.text;
    },

    setTextCls: function(cls) {
        var o = this.options;
        var oldCls = o.textCls;
        o.textCls = cls;
        this.text.element.removeClass(oldCls).addClass(cls);
    },

    setText: function (text) {
        this.text.setText(text);
    },

    setTipType: function (v) {
        this.text.options.tipType = v;
    }
});
BI.shortcut("bi.text_trigger", BI.TextTrigger);
