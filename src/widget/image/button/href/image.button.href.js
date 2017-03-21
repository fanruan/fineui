/**
 * Created by GameJian on 2016/1/28.
 */
BI.ImageButtonHref = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.ImageButtonHref.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-image-button-href",
            title: BI.i18nText("BI-Add_Href")
        })
    },

    _init: function () {
        BI.ImageButtonHref.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.icon_button",
            cls: "img-href-font",
            title: o.title,
            height: 24,
            width: 24
        });

        this.input = BI.createWidget({
            type: "bi.clear_editor",
            watermark: BI.i18nText("BI-Input_Href"),
            width: 255,
            height: 30
        });
        this.input.on(BI.ClearEditor.EVENT_CONFIRM, function () {
            self.combo.hideView();
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            direction: "bottom,left",
            adjustYOffset: 3,
            el: this.trigger,
            popup: {
                el: this.input,
                stopPropagation: false,
                minWidth: 255
            }
        });

        this.combo.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self.input.focus()
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_HIDEVIEW, function () {
            self.fireEvent(BI.ImageButtonHref.EVENT_CHANGE, arguments)
        })
    },

    isSelected: function(){
        return this.combo.isViewVisible();
    },

    showView: function(){
        this.combo.showView();
    },

    hideView: function () {
        this.combo.hideView();
    },

    getValue: function () {
        return this.input.getValue();
    },

    setValue: function (url) {
        this.input.setValue(url)
    }
});
BI.ImageButtonHref.EVENT_CHANGE = "BI.ImageButtonHref.EVENT_CHANGE";
$.shortcut("bi.image_button_href", BI.ImageButtonHref);