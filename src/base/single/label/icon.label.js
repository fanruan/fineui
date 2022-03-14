/**
 * @class BI.IconButton
 * @extends BI.BasicButton
 * 图标标签
 */
BI.IconLabel = BI.inherit(BI.Single, {

    props: {
        baseCls: "bi-icon-label horizon-center",
        hgap: 0,
        vgap: 0,
        tgap: 0,
        bgap: 0,
        lgap: 0,
        rgap: 0,
        iconWidth: null,
        iconHeight: null,
        lineHeight: null,
    },

    render: function () {
        var o = this.options;
        this.element.css({
            textAlign: "center"
        });
        this.icon = BI.createWidget({
            type: "bi.icon",
            width: o.iconWidth,
            height: o.iconHeight
        });
        if (BI.isNumber(o.height) && o.height > 0 && BI.isNull(o.iconWidth) && BI.isNull(o.iconHeight)) {
            this.element.css("lineHeight", (o.lineHeight || o.height) / BI.pixRatio + BI.pixUnit);
            BI.createWidget({
                type: "bi.default",
                element: this,
                hgap: o.hgap,
                vgap: o.vgap,
                lgap: o.lgap,
                rgap: o.rgap,
                tgap: o.tgap,
                bgap: o.bgap,
                items: [this.icon]
            });
        } else {
            this.element.css("lineHeight", "1");
            BI.createWidget({
                element: this,
                type: "bi.center_adapt",
                hgap: o.hgap,
                vgap: o.vgap,
                lgap: o.lgap,
                rgap: o.rgap,
                tgap: o.tgap,
                bgap: o.bgap,
                items: [this.icon]
            });
        }
    }
});
BI.shortcut("bi.icon_label", BI.IconLabel);
