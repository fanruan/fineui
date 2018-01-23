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
            items: [{
                type: "bi.center_adapt",
                cls: o.isPrimary ? "primary-key-region primary-key-font" : "",
                items: [{
                    type: "bi.icon",
                    title: o.isPrimary ? BI.i18nText("BI-Primary_Key") : ""
                }],
                width: 36,
                height: 16
            }, {
                type: "bi.label",
                text: o.text.length > 1 ? BI.i18nText("BI-Basic_Union_Relation") : o.text[0],
                value: o.value,
                height: 24,
                textAlign: "left"
            }]
        };
        if(o.text.length > 1){
            body = BI.map(o.text, function (idx, text) {
                return {
                    el: {
                        type: "bi.label",
                        text: text,
                        value: o.value,
                        height: 24,
                        textAlign: "left"
                    },
                    lgap: 49
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