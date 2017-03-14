/**
 * guy a元素
 * @class BI.Link
 * @extends BI.Text
 */
BI.Link = BI.inherit(BI.Label, {
    _defaultConfig: function() {
        var conf = BI.Link.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-link",
            href: "",
            target: "_blank"
        })
    },

    _createJson: function(){
        var o = this.options;
        return {
            type:"bi.a",
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            lineHeight: o.textHeight,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py,
            href: o.href,
            target: o.target
        };
    },

    _init : function() {
        BI.Link.superclass._init.apply(this, arguments);
    }
});

$.shortcut("bi.link", BI.Link);