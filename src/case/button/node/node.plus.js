/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.PlusGroupNode
 * @extends BI.NodeButton
 */
BI.PlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.PlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-plus-group-node bi-list-item",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            open: false,
            iconWrapperWidth: null,
            height: 24
        });
    },

    render: function () {
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.tree_node_checkbox",
            iconHeight: o.height,
            iconWidth: o.iconWrapperWidth || o.height
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        return {
            type: "bi.vertical_adapt",
            columnSize: [o.iconWrapperWidth || o.height, "fill"],
            items: [this.checkbox, {
                el: {
                    type: "bi.label",
                    ref: function (_ref) {
                        self.text = _ref;
                    },
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    textHeight: o.height,
                    height: o.height,
                    hgap: o.hgap || o.textHgap,
                    vgap: o.textVgap,
                    lgap: o.textLgap,
                    rgap: o.textRgap,
                    text: o.text,
                    value: o.value,
                    keyword: o.keyword,
                    py: o.py
                }
            }]
        };
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.PlusGroupNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.PlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (this.checkbox) {
            this.checkbox.setSelected(v);
        }
    }
});

BI.shortcut("bi.plus_group_node", BI.PlusGroupNode);
