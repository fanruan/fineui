// set、get函数
SetGetView = BI.inherit(BI.View, {
    _defaultConfig: function () {
        return BI.extend(SetGetView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-set-get"
        });
    },

    _init: function () {
        SetGetView.superclass._init.apply(this, arguments);
    },

    change: function (changed) {
        this._showModelData();
    },

    _createLeft: function () {
        var self = this;
        return (this.left = BI.createWidget({
            type: "bi.border",
            items: {
                north: {
                    el: {
                        type: "bi.label",
                        cls: "left-title",
                        text: "get、set用法:",
                        height: 30
                    },
                    height: 30
                },
                center: {
                    el: {
                        type: "bi.button_group",
                        items: BI.createItems(this.model.get("arr"), {
                            type: "bi.text_button",
                            cls: "left-nav",
                            height: 30,
                            handler: function (v) {
                                self.model.set("click", v);
                            }
                        }),
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    }
                }
            }
        }));
    },

    _showModelData: function () {
        this.text.setText(JSON.stringify(this.model.toJSON()));
    },

    _createRight: function () {
        return (this.right = BI.createWidget({
            type: "bi.border",
            items: {
                north: {
                    el: {
                        type: "bi.label",
                        cls: "right-title",
                        text: "Model层数据",
                        height: 30
                    },
                    height: 30
                },
                center: {
                    el: this.text = BI.createWidget({
                        type: "bi.label",
                        whiteSpace: "normal",
                        textHeight: 50
                    })
                }
            }
        }));
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.center",
            element: vessel,
            items: [{
                el: this._createLeft()
            }, {
                el: this._createRight()
            }],
            hgap: 50,
            vgap: 100
        });
        this._showModelData();
    }
});

SetGetModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(SetGetModel.superclass._defaultConfig.apply(this, arguments), {
            arr: [
                {text: "item1", value: 1},
                {text: "item2", value: 2},
                {text: "item3", value: 3},
                {text: "item4", value: 4},
                {text: "item5", value: 5},
                {text: "item6", value: 6},
                {text: "item7", value: 7},
                {text: "item8", value: 8}
            ]
        });
    },

    _init: function () {
        SetGetModel.superclass._init.apply(this, arguments);
    }

});


Demo.Func = BI.inherit(BI.Widget, {
    render: function () {
        var view = BI.View.createView("/setget", {}, {
            element: this
        });
        view.populate();
    },

    mounted: function () {
    }
});
BI.shortcut("demo.setget", Demo.Func);