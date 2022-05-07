/**
 * Created by roy on 15/10/16.
 */
BI.ArrowNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.ArrowNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-arrow-group-node bi-list-item",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            open: false,
            height: 24,
            iconWrapperWidth: 16
        });
    },

    render: function () {
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.arrow_group_node_checkbox"
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
                    py: o.py,
                    keyword: o.keyword
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
        BI.ArrowNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isOpened());
    },

    setText: function (text) {
        BI.ArrowNode.superclass.setText.apply(this, arguments);
        this.text.setText(text);
    },

    setOpened: function (v) {
        BI.ArrowNode.superclass.setOpened.apply(this, arguments);
        this.checkbox.setSelected(v);
    }
});

BI.shortcut("bi.arrow_group_node", BI.ArrowNode);
