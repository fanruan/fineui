/**
 * Created by GUY on 2015/6/26.
 */

BI.Label = BI.inherit(BI.AbstractLabel, {

    props: {
        baseCls: "bi-label",
        py: "",
        keyword: ""
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    }
});

BI.shortcut("bi.label", BI.Label);
