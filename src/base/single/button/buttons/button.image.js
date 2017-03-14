/**
 * 图片的button
 *
 * Created by GUY on 2016/1/27.
 * @class BI.ImageButton
 * @extends BI.BasicButton
 */
BI.ImageButton = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.ImageButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            tagName: "a",
            baseCls: (conf.baseCls || "") + " bi-image-button display-block",
            src: "",
            iconWidth: "100%",
            iconHeight: "100%"
        })
    },

    _init: function () {
        BI.ImageButton.superclass._init.apply(this, arguments);
        var o = this.options;
        this.image = BI.createWidget({
            type: "bi.img",
            width: o.iconWidth,
            height: o.iconHeight,
            src: o.src
        });
        if (BI.isNumber(o.iconWidth) || BI.isNumber(o.iconHeight)) {
            BI.createWidget({
                type: "bi.center_adapt",
                element: this.element,
                items: [this.image]
            })
        } else {
            BI.createWidget({
                type: "bi.adaptive",
                element: this.element,
                items: [this.image],
                scrollable: false
            })
        }
    },

    setWidth: function (w) {
        BI.ImageButton.superclass.setWidth.apply(this, arguments);
        this.options.width = w;
    },

    setHeight: function (h) {
        BI.ImageButton.superclass.setHeight.apply(this, arguments);
        this.options.height = h;
    },

    setImageWidth: function (w) {
        this.image.setWidth(w);
    },

    setImageHeight: function (h) {
        this.image.setHeight(h);
    },

    getImageWidth: function () {
        return this.image.element.width();
    },

    getImageHeight: function () {
        return this.image.element.height();
    },

    setSrc: function (src) {
        this.options.src = src;
        this.image.setSrc(src);
    },

    getSrc: function () {
        return this.image.getSrc();
    },

    doClick: function () {
        BI.ImageButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.ImageButton.EVENT_CHANGE, this);
        }
    }
});
BI.ImageButton.EVENT_CHANGE = "ImageButton.EVENT_CHANGE";
$.shortcut("bi.image_button", BI.ImageButton);