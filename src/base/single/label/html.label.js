/**
 * Created by GUY on 2015/6/26.
 */

BI.HtmlLabel = BI.inherit(BI.AbstractLabel, {

    props: {
        baseCls: "bi-html-label",
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
        text: ""
    },

    _createJson: function () {
        var o = this.options;
        return {
            type: "bi.html",
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            lineHeight: o.textHeight,
            text: o.text,
            value: o.value
        };
    }
});

BI.shortcut("bi.html_label", BI.HtmlLabel);