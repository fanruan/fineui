/**
 * 拖拽字段的helper
 * Created by roy on 15/10/13.
 */
BI.Helper = BI.inherit(BI.Tip, {
    _defaultConfig: function () {
        return BI.extend(BI.Helper.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-helper",
            text: "",
            value: ""
        })
    },

    _init: function () {
        BI.Helper.superclass._init.apply(this, arguments);
        this.populate();
    },

    modifyContent: function(widget) {
        this.empty();
        BI.createWidget({
            type: "bi.left",
            element: this,
            cls: "dragging-modify",
            items: [widget],
            lgap: 15
        });
    },

    populate: function () {
        var o = this.options;
        this.element.data({helperWidget: this});
        this.empty();
        BI.createWidget({
            element: this,
            type: "bi.label",
            textAlign: "center",
            textHeight: 20,
            hgap: 5,
            text: o.text,
            value: o.value
        });
        this.element.removeClass("dragging-modify");
    }
});
$.shortcut("bi.helper", BI.Helper);