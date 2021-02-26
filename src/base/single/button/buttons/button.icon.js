/**
 * @class BI.IconButton
 * @extends BI.BasicButton
 * 图标的button
 */
BI.IconButton = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.IconButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            _baseCls: (conf._baseCls || "") + " bi-icon-button horizon-center",
            iconWidth: null,
            iconHeight: null
        });
    },

    _init: function () {
        BI.IconButton.superclass._init.apply(this, arguments);
        var o = this.options;
        this.element.css({
            textAlign: "center"
        });
        this.icon = BI.createWidget({
            type: "bi.icon",
            width: o.iconWidth,
            height: o.iconHeight
        });
        if (BI.isNumber(o.height) && o.height > 0 && BI.isNull(o.iconWidth) && BI.isNull(o.iconHeight)) {
            this.element.css("lineHeight", o.height / BI.pixRatio + BI.pixUnit);
            BI.createWidget({
                type: "bi.default",
                element: this,
                items: [this.icon]
            });
        } else {
            this.element.css("lineHeight", "1");
            BI.createWidget({
                element: this,
                type: "bi.center_adapt",
                items: [this.icon]
            });
        }
    },

    doClick: function () {
        BI.IconButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.IconButton.EVENT_CHANGE, this);
        }
    }
});
BI.IconButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_button", BI.IconButton);
