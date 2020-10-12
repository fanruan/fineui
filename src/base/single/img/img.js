/**
 * ͼƬ
 *
 * Created by GUY on 2016/1/26.
 * @class BI.Img
 * @extends BI.Single
 * @abstract
 */
BI.Img = BI.inherit(BI.Single, {
    _defaultConfig: function (config) {
        var conf = BI.Img.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            tagName: "img",
            baseCls: (conf.baseCls || "") + " bi-img display-block",
            src: "",
            attributes: config.src ? { src: config.src } : {},
            width: "100%",
            height: "100%"
        });
    },

    _init: function () {
        BI.Img.superclass._init.apply(this, arguments);
        this.setSrc(this.options.src);
    },

    setSrc: function (src) {
        this.options.src = src;
        this.element.attr("src", src);
    },

    getSrc: function () {
        return this.options.src;
    }
});

BI.shortcut("bi.img", BI.Img);
