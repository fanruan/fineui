/**
 * @class BI.Iframe
 * @extends BI.Single
 * @abstract
 * Created by GameJian on 2016/3/2.
 */
BI.Iframe = BI.inherit(BI.Single, {
    _defaultConfig: function (config) {
        var conf = BI.Iframe.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            tagName: "iframe",
            baseCls: (conf.baseCls || "") + " bi-iframe",
            src: "",
            name: "",
            attributes: {},
            width: "100%",
            height: "100%"
        });
    },

    _init: function () {
        var self = this, o = this.options;
        o.attributes.frameborder = "0";
        o.attributes.src = o.src;
        o.attributes.name = o.name;
        BI.Iframe.superclass._init.apply(this, arguments);
        this.element.on("load", function () {
            self.fireEvent("EVENT_LOADED");
        });
    },

    setSrc: function (src) {
        this.options.src = src;
        this.element.attr("src", src);
    },

    getSrc: function () {
        return this.options.src;
    },

    setName: function (name) {
        this.options.name = name;
        this.element.attr("name", name);
    },

    getName: function () {
        return this.options.name;
    }
});

BI.shortcut("bi.iframe", BI.Iframe);
