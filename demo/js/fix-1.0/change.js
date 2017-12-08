// change函数
ChangeView = BI.inherit(BI.View, {
    _defaultConfig: function () {
        return BI.extend(ChangeView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-change"
        });
    },

    _init: function () {
        ChangeView.superclass._init.apply(this, arguments);
    },

    change: function (changed) {
        if(changed.child) {
            this._showModelData();
        }
        if(changed.superiors) {
            this._showModelData();
        }
    },

    _showModelData: function () {
        this.outerText.setText("父级Model层数据: " + JSON.stringify(this.model.toJSON()));
    },

    _createOuter: function () {
        this.outerText = BI.createWidget({
            type: "bi.label",
            cls: "outer-text",
            whiteSpace: "normal"
        });

        return BI.createWidget({
            type: "bi.border",
            items: {
                north: {
                    el: this.outerText,
                    height: 50
                },
                center: this._createInner()
            }
        });
    },

    _createInner: function () {
        var innerPane = BI.createWidget({
            type: "bi.absolute",
            cls: "inner"
        });
        this.addSubVessel("innerPane", innerPane, {
            defaultShowName: "inner"
        });
        return innerPane;
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.center",
            element: vessel,
            items: [this._createOuter()],
            hgap: 100,
            vgap: 100
        });

        this._showModelData();
    },

    refresh: function () {
        this.skipTo("inner", "innerPane", "superiors");
    }
});

ChangeModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(ChangeModel.superclass._defaultConfig.apply(this, arguments), {
            superiors: {
                child: "default"
            },
            child: "default"
        });
    },

    _init: function () {
        ChangeModel.superclass._init.apply(this, arguments);
    },

    change: function (changed) {
        if(changed.superiors) {
            this.set("child", changed.superiors.child);
        }
    }
});

// ChangeView 的子级
ChangeInnerView = BI.inherit(BI.View, {
    _init: function () {
        ChangeInnerView.superclass._init.apply(this, arguments);
    },

    change: function (changed) {
        if(changed.child) {
            this._showModelData();
        }
    },

    _createOuter: function () {
        var self = this;
        this.text = BI.createWidget({
            type: "bi.label",
            height: 26
        });

        this.buttons = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(this.model.get("items"), {
                type: "bi.text_button",
                height: 30,
                textAlign: "center",
                hgap: 20
            })
        });

        this.buttons.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.model.set("child", this.getValue()[0]);
        });

        return BI.createWidget({
            type: "bi.vertical",
            vgap: 20,
            items: [{
                type: "bi.center",
                items: [this.buttons],
                height: 30
            }, this.text]
        });
    },

    _showModelData: function () {
        this.text.setText("子级Model层数据: " + JSON.stringify(this.model.toJSON()));
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.center",
            element: vessel,
            items: [this._createOuter()]
        });
        this._showModelData();
    }
});


ChangeInnerModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(ChangeInnerModel.superclass._defaultConfig.apply(this, arguments), {

        });
    },

    _static: function () {
        return {
            items: [{
                text: "Type-1",
                value: "First",
                cls: "type-first mvc-button"
            }, {
                text: "Type-2",
                value: "Second",
                cls: "type-second mvc-button"
            }, {
                text: "Type-3",
                value: "third",
                cls: "type-third mvc-button"
            }]
        };
    },

    _init: function () {
        ChangeInnerModel.superclass._init.apply(this, arguments);
    }

});

Demo.Func = BI.inherit(BI.Widget, {
    render: function () {
        var view = BI.View.createView("/change", {}, {
            element: this
        });
        view.populate();
    },

    mounted: function () {
    }
});
BI.shortcut("demo.change", Demo.Func);