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
        iconWidth: 18
    },

    _defaultConfig: function (props) {
        var conf = BI.Button.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-button" + ((BI.isIE() && BI.isIE9Below()) ? " hack" : ""),
            minWidth: (props.block === true || props.clear === true) ? 0 : 80,
            height: 24,
            shadow: props.clear !== true,
            isShadowShowingOnSelected: true,
            readonly: true,
            iconCls: "",
            level: "common",
            block: false, // 是否块状显示，即不显示边框，没有最小宽度的限制
            clear: false, // 是否去掉边框和背景
            ghost: false, // 是否幽灵显示, 即正常状态无背景
            textAlign: "center",
            whiteSpace: "nowrap",
            textWidth: null,
            textHeight: null,
            hgap: props.clear ? 0 : 10,
            vgap: 0,
            tgap: 0,
            bgap: 0,
            lgap: 0,
            rgap: 0
        });
    },

    _init: function () {
        BI.Button.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        if (BI.isKey(o.iconCls)) {
            this.icon = BI.createWidget({
                type: "bi.icon_label",
                cls: o.iconCls,
                width: this._const.iconWidth,
                height: o.height - 2,
                iconWidth: o.iconWidth,
                iconHeight: o.iconHeight
            });
            this.text = BI.createWidget({
                type: "bi.label",
                text: o.text,
                textWidth: BI.isNotNull(o.textWidth) ? o.textWidth - this._const.iconWidth : null,
                textHeight: o.textHeight,
                value: o.value,
                height: o.height - 2
            });
            BI.createWidget({
                type: "bi.center_adapt",
                element: this,
                hgap: o.hgap,
                vgap: o.vgap,
                items: [{
                    type: "bi.horizontal",
                    columnSize: ["", "fill"],
                    items: [this.icon, this.text]
                }]
            });
        } else {
            this.text = BI.createWidget({
                type: "bi.label",
                height: o.height,
                textAlign: o.textAlign,
                whiteSpace: o.whiteSpace,
                textWidth: o.textWidth,
                textHeight: o.textHeight,
                hgap: o.hgap,
                vgap: o.vgap,
                tgap: o.tgap,
                bgap: o.bgap,
                lgap: o.lgap,
                rgap: o.rgap,
                element: this,
                text: o.text,
                value: o.value
            });
        }
        if (BI.isNumber(o.height) && !o.clear && !o.block) {
            this.element.css({
                height: o.height / BI.pixRatio + BI.pixUnit,
                lineHeight: (o.height - 2) / BI.pixRatio + BI.pixUnit
            });
        } else if (o.clear || o.block) {
            this.element.css({lineHeight: o.height / BI.pixRatio + BI.pixUnit});
        } else {
            this.element.css({lineHeight: (o.height - 2) / BI.pixRatio + BI.pixUnit});
        }
        if (o.block === true) {
            this.element.addClass("block");
        }
        if (o.clear === true) {
            this.element.addClass("clear");
        }
        if (o.ghost === true) {
            this.element.addClass("ghost");
        }
        if (o.minWidth > 0) {
            this.element.css({"min-width": o.minWidth / BI.pixRatio + BI.pixUnit});
        }
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
BI.shortcut("bi.button", BI.Button);
BI.Button.EVENT_CHANGE = "EVENT_CHANGE";
