/**
 * ͼƬ
 *
 * Created by GUY on 2016/1/26.
 * @class BI.Img
 * @extends BI.Single
 * @abstract
 */
BI.Img = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Img.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-img",
            src: "",
            width: "100%",
            height: "100%"
        })
    },

    _init: function () {
        var o = this.options;
        this.options.element = $("<img src='" + o.src + "'>");
        BI.Img.superclass._init.apply(this, arguments);
    },

    setSrc: function (src) {
        this.options.src = src;
        this.element.attr("src", src);
    },

    getSrc: function () {
        return this.options.src;
    }
});

$.shortcut("bi.img", BI.Img);