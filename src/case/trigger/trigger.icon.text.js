/**
 * 文字trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.IconTextTrigger
 * @extends BI.Trigger
 */
BI.IconTextTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4
    },

    _defaultConfig: function () {
        var conf = BI.IconTextTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-trigger",
            height: 24
        });
    },

    _init: function () {
        BI.IconTextTrigger.superclass._init.apply(this, arguments);
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
            cls: "bi-border-left",
            width: o.triggerWidth || o.height
        });

        BI.createWidget({
            element: this,
            type: 'bi.htape',
            ref: function (_ref) {
                self.wrapper = _ref;
            },
            items: [{
                el: {
                    type: "bi.icon_change_button",
                    cls: "icon-combo-trigger-icon " + o.iconClass,
                    ref: function (_ref) {
                        self.icon = _ref;
                    },
                    disableSelected: true
                },
                width: o.triggerWidth || o.height
            },
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
        this.text.setTitle(value);
    },

    setIcon: function (iconCls) {
        var o = this.options;
        this.icon.setIcon(iconCls);
        var iconItem = this.wrapper.attr("items")[0];
        if(BI.isNull(iconCls) || BI.isEmptyString(iconCls)){
            if(iconItem.width !== 0){
                iconItem.width = 0;
                this.wrapper.resize();
            }
        }else{
            if(iconItem.width !== (o.triggerWidth || o.height)){
                iconItem.width = (o.triggerWidth || o.height);
                this.wrapper.resize();
            }
        }
    },

    setText: function (text) {
        this.text.setText(text);
        this.text.setTitle(text);
    }
});
BI.shortcut("bi.icon_text_trigger", BI.IconTextTrigger);