/**
 * @class BI.IconButton
 * @extends BI.BasicButton
 * 图标的button
 */
BI.IconButton = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.IconButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            tagName: "a",
            baseCls: (conf.baseCls || "") + " bi-icon-button horizon-center display-block",
            iconWidth: null,
            iconHeight: null
        })
    },

    _init: function () {
        BI.IconButton.superclass._init.apply(this, arguments);
        var o = this.options;
        this.element.css({
            textAlign: 'center'
        });
        this.icon = BI.createWidget({
            type: 'bi.icon',
            width: o.iconWidth,
            height: o.iconHeight
        });
        if (BI.isNumber(o.height) && o.height > 0 && BI.isNull(o.iconWidth) && BI.isNull(o.iconHeight)) {
            this.element.css("lineHeight", o.height + "px");
            BI.createWidget({
                type: "bi.default",
                element: this.element,
                items: [this.icon]
            })
        } else {
            BI.createWidget({
                element: this.element,
                type: 'bi.center_adapt',
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
BI.IconButton.EVENT_CHANGE = "IconButton.EVENT_CHANGE";
$.shortcut("bi.icon_button", BI.IconButton);