/**
 * 图片尺寸控件
 * Created by GameJian on 2016/1/28.
 */
BI.ImageButtonSizeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ImageButtonSizeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-image-button-size-combo",
            title: BI.i18nText("BI-Image_Size")
        })
    },

    _init: function () {
        BI.ImageButtonSizeCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.icon_button",
            cls: "img-size-font",
            title: o.title,
            width: 24,
            height: 24
        });
        this.sizeChooser = BI.createWidget({
            type: "bi.image_button_size"
        });
        this.sizeChooser.on(BI.ImageButtonSize.EVENT_CHANGE, function(){
            self.fireEvent(BI.ImageButtonSizeCombo.EVENT_CHANGE,arguments)
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustWidth: false,
            direction: "top",
            adjustYOffset: 3,
            offsetStyle: "right",
            el: this.trigger,
            popup: {
                el: this.sizeChooser,
                stopPropagation: false
            }
        });
    },

    setValue: function (v) {
        this.sizeChooser.setValue(v);
    },

    getValue: function () {
        return this.sizeChooser.getValue();
    }
});
BI.ImageButtonSizeCombo.EVENT_CHANGE = "ImageButtonSizeCombo.EVENT_CHANGE";
$.shortcut("bi.image_button_size_combo", BI.ImageButtonSizeCombo);