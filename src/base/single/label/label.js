/**
 * Created by GUY on 2015/6/26.
 */

BI.Label = BI.inherit(BI.AbstractLabel, {

    props: {
        baseCls: "bi-label",
        textAlign: "center",
        whiteSpace: "nowrap", // normal  or  nowrap
        textWidth: null,
        textHeight: null,
        hgap: 0,
        vgap: 0,
        lgap: 0,
        rgap: 0,
        tgap: 0,
        bgap: 0,
        text: "",
        py: "",
        keyword: "",
        highLight: false
    },

    _createJson: function () {
        var o = this.options;
        return {
            type: "bi.text",
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            lineHeight: o.textHeight,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword,
            highLight: o.highLight
        };
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    }
});

BI.shortcut("bi.label", BI.Label);