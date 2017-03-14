/**
 * guy
 * 复选框item
 * @type {*|void|Object}
 */
BI.MidTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MidTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-mid-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            layer: 0,
            height: 25
        })
    },
    _init: function () {
        BI.MidTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.checkbox"
        });
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, ((o.layer === 0) ? "" : {
            width: 13,
            el: {
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            }
        }), {
            width: 25,
            el: {
                type: "bi.layout",
                cls: "mid-line-conn-background",
                width: 25,
                height: o.height
            }
        }, {
            el: this.text
        });
        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items
        }))));
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.MidTreeLeafItem.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.MidTreeLeafItem.superclass.setSelected.apply(this, arguments);
        this.checkbox.setSelected(v);
    }
});

$.shortcut("bi.mid_tree_leaf_item", BI.MidTreeLeafItem);