/**
 * 关联视图
 *
 * Created by GUY on 2015/12/23.
 * @class BI.RelationViewRegion
 * @extends BI.BasicButton
 */
BI.RelationViewRegion = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        return BI.extend(BI.RelationViewRegion.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-relation-view-region cursor-pointer",
            width: 150,
            text: "",
            value: "",
            header: "",
            items: [],
            belongPackage: true
        });
    },

    _init: function () {
        BI.RelationViewRegion.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.preview = BI.createWidget({
            type: "bi.icon_button",
            cls: "relation-table-preview-font",
            width: 25,
            height: 25,
            stopPropagation: true
        });
        this.preview.on(BI.IconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.RelationViewRegion.EVENT_PREVIEW, this.isSelected());
        });

        this.title = BI.createWidget({
            type: "bi.label",
            height: 25,
            width: 70,
            text: o.text,
            value: o.value,
            textAlign: "left"
        });
        // title放body上
        if (BI.isKey(o.header)) {
            this.title.setTitle(o.header, {
                container: "body"
            });
        }

        this.button_group = BI.createWidget({
            type: "bi.button_group",
            items: this._createItems(o.items),
            layouts: [{
                type: "bi.vertical"
            }]
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [{
                type: "bi.vertical",
                cls: "relation-view-region-container bi-card bi-border " + (o.belongPackage ? "" : "other-package"),
                items: [{
                    type: "bi.vertical_adapt",
                    cls: "relation-view-region-title bi-border-bottom bi-background",
                    items: [this.preview, this.title]
                }, this.button_group]
            }],
            hgap: 25,
            vgap: 20
        });
    },

    _createItems: function (items) {
        var self = this;
        return BI.map(items, function (i, item) {
            var texts = BI.isArray(item.text) ? item.text : [item.text];
            return BI.extend(item, {
                type: "bi.relation_view_item",
                height: texts.length > 1 ? (texts.length + 1) * 25 : 25,
                hoverIn: function () {
                    self.setValue(item.value);
                    self.fireEvent(BI.RelationViewRegion.EVENT_HOVER_IN, item.value);
                },
                hoverOut: function () {
                    self.setValue([]);
                    self.fireEvent(BI.RelationViewRegion.EVENT_HOVER_OUT, item.value);
                }
            });
        });
    },

    doRedMark: function () {
        this.title.doRedMark.apply(this.title, arguments);
    },

    unRedMark: function () {
        this.title.unRedMark.apply(this.title, arguments);
    },

    getWidth: function () {
        return this.options.width;
    },

    getHeight: function () {
        var height = 0;
        BI.each(this.button_group.getAllButtons(), function (idx, button) {
            height += button.getHeight();
        });
        return height + 25 + 2 * 20 + 3;
    },

    // 获取上方开始划线的位置
    getTopLeftPosition: function () {
        return {
            x: 25 + 10,
            y: 20
        };
    },

    getTopRightPosition: function () {
        return {
            x: this.getWidth() - 25 - 10,
            y: 20
        };
    },

    getBottomPosition: function () {
        return {
            x: 25 + 10,
            y: this.getHeight() - 20
        };
    },

    getLeftPosition: function () {
        return {
            x: 25,
            y: 20 + 10
        };
    },

    getRightPosition: function () {
        return {
            x: this.getWidth() - 25,
            y: 20 + 10
        };
    },

    setValue: function (v) {
        this.button_group.setValue(v);
    },

    setPreviewSelected: function (v) {
        this.preview.setSelected(v);
    }
});
BI.RelationViewRegion.EVENT_HOVER_IN = "RelationViewRegion.EVENT_HOVER_IN";
BI.RelationViewRegion.EVENT_HOVER_OUT = "RelationViewRegion.EVENT_HOVER_OUT";
BI.RelationViewRegion.EVENT_PREVIEW = "RelationViewRegion.EVENT_PREVIEW";
BI.shortcut("bi.relation_view_region", BI.RelationViewRegion);