(function ($) {

    /**
     * 文字类型的按钮
     * @class BI.Button
     * @extends BI.BasicButton
     *
     * @cfg {JSON} options 配置属性
     * @cfg {'common'/'success'/'warning'/'ignore'} [options.level='common'] 按钮类型，用不同颜色强调不同的场景
     */
    BI.Button = BI.inherit(BI.BasicButton, {
        _const: {
            minWidth: 90
        },

        _defaultConfig: function () {
            var conf = BI.Button.superclass._defaultConfig.apply(this, arguments);
            return BI.extend(conf, {
                baseCls: (conf.baseCls || "") + ' bi-button',
                shadow: true,
                isShadowShowingOnSelected: true,
                readonly: true,
                iconClass: "",
                level: 'common',
                textAlign: "center",
                whiteSpace: "nowrap",
                forceCenter: false,
                textWidth: null,
                textHeight: null,
                hgap: 10,
                vgap: 0,
                tgap: 0,
                bgap: 0,
                lgap: 0,
                rgap: 0
            })
        },

        _init: function () {
            BI.Button.superclass._init.apply(this, arguments);
            var o = this.options, self = this;
            if (BI.isNumber(o.height)) {
                this.element.css({height: o.height - 2, lineHeight: (o.height - 2) + 'px'});
            }
            if (BI.isKey(o.iconClass)) {
                this.icon = BI.createWidget({
                    type: "bi.icon",
                    width: 18
                });
                this.text = BI.createWidget({
                    type: "bi.label",
                    text: o.text,
                    value: o.value
                });
                BI.createWidget({
                    type: "bi.horizontal_auto",
                    cls: "button-" + o.level + " " + o.iconClass,
                    element: this.element,
                    hgap: o.hgap,
                    vgap: o.vgap,
                    tgap: o.tgap,
                    bgap: o.bgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    items: [{
                        type: "bi.horizontal",
                        items: [this.icon, this.text]
                    }]
                })
            } else {
                this.text = BI.createWidget({
                    type: "bi.label",
                    cls: "button-" + o.level,
                    textAlign: o.textAlign,
                    whiteSpace: o.whiteSpace,
                    forceCenter: o.forceCenter,
                    textWidth: o.textWidth,
                    textHeight: o.textHeight,
                    hgap: o.hgap,
                    vgap: o.vgap,
                    tgap: o.tgap,
                    bgap: o.bgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    element: this.element,
                    text: o.text,
                    value: o.value
                });
            }
            this.element.css({"min-width": this._const.minWidth - 2 + "px"});
        },

        doClick: function () {
            BI.Button.superclass.doClick.apply(this, arguments);
            if (this.isValid()) {
                this.fireEvent(BI.Button.EVENT_CHANGE, this);
            }
        },

        setText: function (text) {
            BI.Button.superclass.setText.apply(this, arguments);
            this.text.setText(text);
        },

        setValue: function (text) {
            BI.Button.superclass.setValue.apply(this, arguments);
            if (!this.isReadOnly()) {
                this.text.setValue(text);
            }
        },

        setEnable: function (b) {
            BI.Button.superclass.setEnable.apply(this, arguments);
            this.text.setEnable(b);
            this.icon && this.icon.setEnable(b);
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
        },

        destroy: function () {
            BI.Button.superclass.destroy.apply(this, arguments);
        }
    });
    $.shortcut('bi.button', BI.Button);
    BI.Button.EVENT_CHANGE = "EVENT_CHANGE";
})(jQuery);