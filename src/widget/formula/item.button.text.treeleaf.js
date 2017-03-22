BI.ButtonTextTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.ButtonTextTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-button-text-tree-item ",
            id: "",
            pId: "",
            height: 25,
            hgap: 0,
            lgap: 0,
            rgap: 0
        })
    },
    _init: function () {
        BI.ButtonTextTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            lgap: o.lgap,
            rgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.button = BI.createWidget({
            type: "bi.text_button",
            height: 25,
            stopEvent:true,
            value: BI.i18nText("BI-Formula_Insert"),
            cls: "formula-function-insert-button"
        });
        this.button.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.ADD, self.text.getText());
        });
        this.button.invisible();
        this.leaf = BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.button,
                width: 30
            }, {
                el: this.text
            }],
            hgap: o.hgap
        })
        this.element.hover(function () {
            self.button.visible();
        }, function () {
            if (!self.isSelected()) {
                self.button.invisible();
            }

        })

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

    setSelected: function (b) {
        BI.ButtonTextTreeLeafItem.superclass.setSelected.apply(this, arguments);
        if (BI.isNotNull(b) && b === true) {
            this.button.visible();
        } else {
            this.button.invisible();
        }
    },


    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    }
});

$.shortcut("bi.button_text_tree_leaf_item", BI.ButtonTextTreeLeafItem);