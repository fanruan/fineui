BI.MultiLayerIconArrowNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerIconArrowNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-icon-arrow-node bi-list-item",
            layer: 0,//第几层级
            id: "",
            pId: "",
            open: false,
            height: 25,
            iconHeight: 13,
            iconWidth: 13,
            iconCls: ""
        })
    },
    _init: function () {
        BI.MultiLayerIconArrowNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.icon_arrow_node",
            iconCls: o.iconCls,
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.setSelected(self.isSelected());
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                width: 13,
                height: o.height
            })
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this.element,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        })
    },

    isOnce: function () {
        return true;
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    isSelected: function () {
        return this.node.isSelected();
    },

    setSelected: function (b) {
        BI.MultiLayerIconArrowNode.superclass.setSelected.apply(this, arguments);
        this.node.setSelected(b);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerIconArrowNode.superclass.setOpened.apply(this, arguments);
        this.node.setOpened(v);
    }
});

$.shortcut("bi.multilayer_icon_arrow_node", BI.MultiLayerIconArrowNode);