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
            height: 25,
            hoverIn: BI.emptyFn,
            hoverOut: BI.emptyFn
        });
    },

    _init: function () {
        BI.RelationViewItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.element.hover(o.hoverIn, o.hoverOut);
        var items = [];
        if (o.isPrimary) {
            items.push({
                type: "bi.icon",
                width: 16,
                height: 16,
                title: BI.i18nText("BI-Primary_Key")
            });
        }
        items.push({
            type: "bi.label",
            text: o.text,
            value: o.value,
            height: o.height,
            textAlign: "left",
            width: o.isPrimary ? 70 : 90,
            lgap: o.isPrimary ? 0 : 10
        });
        BI.createWidget({
            type: "bi.vertical_adapt",
            element: this,
            items: items,
            cls: "primary-key-font",
            lgap: 5
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