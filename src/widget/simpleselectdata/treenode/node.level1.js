/**
 * Created by GUY on 2015/9/6.
 * @class BI.SimpleSelectDataLevel1Node
 * @extends BI.NodeButton
 */
BI.SimpleSelectDataLevel1Node = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SimpleSelectDataLevel1Node.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-simple-select-data-level1-node bi-list-item",
            id: "",
            pId: "",
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.SimpleSelectDataLevel1Node.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.checkbox = BI.createWidget({
            type: "bi.tree_group_node_checkbox"
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
            if(type ===  BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.layout"
                },
                width: 10
            },{
                width: 23,
                el: this.checkbox
            }, {
                el: this.text
            }]
        })
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.SimpleSelectDataLevel1Node.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isOpened());
    },

    setOpened: function (v) {
        BI.SimpleSelectDataLevel1Node.superclass.setOpened.apply(this, arguments);
        this.checkbox.setSelected(v);
    },

    setEnable: function (b) {
        BI.SimpleSelectDataLevel1Node.superclass.setEnable.apply(this, arguments);
        this.checkbox.setEnable(b);
    }
});

$.shortcut("bi.simple_select_data_level1_node", BI.SimpleSelectDataLevel1Node);