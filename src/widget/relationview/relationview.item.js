/**
 * 关联视图字段Item
 *
 * Created by GUY on 2015/12/23.
 * @class BI.RelationViewItem
 * @extends BI.Widget
 */
BI.RelationViewItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        return BI.extend(BI.RelationViewItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-relation-view-item bi-list-item-active",
            hoverIn: BI.emptyFn,
            hoverOut: BI.emptyFn
        });
    },

    _init: function () {
        BI.RelationViewItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.element.hover(o.hoverIn, o.hoverOut);
        o.text = BI.isArray(o.text) ? o.text : [o.text];
        var body = [];
        var header = {
            type: "bi.vertical_adapt",
            cls: "primary-key-font",
            items: []
        };
        if (o.isPrimary) {
            header.items.push({
                type: "bi.icon",
                width: 12,
                height: 16,
                title: BI.i18nText("BI-Primary_Key")
            });
        }
        header.items.push({
            type: "bi.label",
            text: o.text.length > 1 ? BI.i18nText("BI-Basic_Union_Relation") : o.text[0],
            value: o.value,
            height: 25,
            textAlign: "left",
            width: o.isPrimary ? 70 : 90,
            lgap: o.isPrimary ? 0 : 10
        });
        if(o.text.length > 1){
            body = BI.map(o.text, function (idx, text) {
                return {
                    type: "bi.label",
                    text: text,
                    value: o.value,
                    height: 25,
                    textAlign: "left",
                    width: 70,
                    lgap: 15
                }
            })
        }
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: BI.concat([header], body)
        });
    },

    enableHover: function (opt) {
        BI.RelationViewRegion.superclass.enableHover.apply(this, [{
            container: "body"
        }]);
    },

    setSelected: function (b) {
        this.element[b ? "addClass" : "removeClass"]("active");
    }
});
BI.shortcut("bi.relation_view_item", BI.RelationViewItem);