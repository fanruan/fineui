/**
 * @class BI.Iframe
 * @extends BI.Single
 * @abstract
 * Created by GameJian on 2016/3/2.
 */
BI.Iframe = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Iframe.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-iframe",
            src: "",
            width: "100%",
            height: "100%"
        })
    },

    _init: function () {
        var o = this.options;
        this.options.element = $("<iframe frameborder='0' src='" + o.src + "'>");
        BI.Iframe.superclass._init.apply(this, arguments);
    },

    setSrc: function (src) {
        this.options.src = src;
        this.element.attr("src", src);
    },

    getSrc: function () {
        return this.options.src;
    },

    getWidth: function () {
        return this.options.width
    },

    getHeight: function () {
        return this.options.height
    }
});

$.shortcut("bi.iframe", BI.Iframe);