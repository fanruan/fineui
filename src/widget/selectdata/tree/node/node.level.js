/**
 * Created by GUY on 2015/9/6.
 * @class BI.SelectDataLevelNode
 * @extends BI.NodeButton
 */
BI.SelectDataLevelNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataLevelNode.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-select-data-level0-node bi-list-item",
            id: "",
            pId: "",
            layer: 0,
            open: false,
            height: 25
        })
    },
    _init: function () {
        var title = this.options.title;
        var warningTitle = this.options.warningTitle;
        this.options.title = "";
        this.options.warningTitle = "";
        BI.SelectDataLevelNode.superclass._init.apply(this, arguments);
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
            keyword: o.keyword,
            title: title,
            warningTitle: warningTitle,
            disabled: o.disabled,
            py: o.py
        });
        this.tip = BI.createWidget({
            type: "bi.label",
            cls: "select-data-selected-count-label",
            whiteSpace: "nowrap",
            width: 25,
            height: o.height
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
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
                width: o.layer * 20
            }, {
                width: 23,
                el: this.checkbox
            }, {
                el: this.text
            }, {
                width: 25,
                el: this.tip
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
        BI.SelectDataLevelNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isOpened());
    },

    setOpened: function (v) {
        BI.SelectDataLevelNode.superclass.setOpened.apply(this, arguments);
        this.checkbox.setSelected(v);
    },

    setValue: function (items) {
        BI.SelectDataLevelNode.superclass.setValue.apply(this, arguments);
        if (BI.isEmpty(items)) {
            this.tip.setText("");
        } else {
            this.tip.setText("(" + items.length + ")");
        }
        this.tip.setTitle(items.toString());
    },

    setEnable: function (b) {
        BI.SelectDataLevelNode.superclass.setEnable.apply(this, arguments);
        this.checkbox.setEnable(b);
        this.text.setEnable(b);
    }
});

$.shortcut("bi.select_data_level_node", BI.SelectDataLevelNode);