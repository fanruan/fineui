/**
 * Created by GUY on 2015/6/26.
 */

BI.Label = BI.inherit(BI.AbstractLabel, {

    props: {
        baseCls: "bi-label",
        py: "",
        keyword: ""
    },

    _createJson: function () {
        var o = this.options;
        return {
            type: "bi.text",
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            lineHeight: o.textHeight,
            lineNumber: o.lineNumber,
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