/**
 * Created by GUY on 2015/6/26.
 */

BI.HtmlLabel = BI.inherit(BI.AbstractLabel, {

    props: {
        baseCls: "bi-html-label"
    },

    _createJson: function () {
        var o = this.options;
        return {
            type: "bi.html",
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            lineHeight: o.textHeight,
            text: o.text,
            value: o.value,
            handler: o.handler
        };
    }
});

BI.shortcut("bi.html_label", BI.HtmlLabel);