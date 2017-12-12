// local函数
LocalView = BI.inherit(BI.View, {
    _defaultConfig: function () {
        return BI.extend(LocalView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-local"
        });
    },

    _init: function () {
        LocalView.superclass._init.apply(this, arguments);
        this.buttons = {};
    },

    _addElement2Vessel: function (id) {
        var self = this;
        this.buttons[id] = this.elementVessel.addItem({
            type: "bi.text_button",
            text: "Button:" + id,
            width: 180,
            height: 22,
            cls: "delete-button button",
            handler: function () {
                self.set("delete", id);
            }
        });
    },

    _deleteElement: function (id) {
        this.buttons[id] && this.buttons[id].destroy();
        delete this.buttons[id];
    },

    _createTop: function () {
        var self = this;
        this.elementVessel = BI.createWidget({
            type: "bi.left",
            height: 200,
            cls: "vessel-border",
            scrollable: true,
            vgap: 10,
            hgap: 10
        });

        return BI.createWidget({
            type: "bi.vertical",
            items: [
                {
                    el: {
                        type: "bi.text_button",
                        text: "点击添加元素",
                        cls: "top-button",
                        handler: function () {
                            self.model.set("add", true);
                        },
                        height: 30
                    }
                },
                this.elementVessel
            ]
        });
    },

    _showModelData: function () {
        this.text.setText(JSON.stringify(this.model.toJSON()));
    },

    _createCenter: function () {
        var modelData = BI.createWidget({
            type: "bi.center",
            vgap: 10,
            hgap: 10,
            cls: "vessel-border",
            height: 200,
            items: [{
                el: this.text = BI.createWidget({
                    type: "bi.label",
                    hgap: 30,
                    textHeight: 30,
                    whiteSpace: "normal"
                })
            }]
        });

        return BI.createWidget({
            type: "bi.vertical",
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "bottom-label",
                        text: "Model层数据",
                        height: 30
                    }
                },
                modelData
            ]
        });
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.vertical",
            element: vessel,
            items: [{
                el: this._createTop()
            }, {
                el: this._createCenter()
            }],
            hgap: 50,
            vgap: 20
        });

        this._showModelData();
    },

    local: function () {
        if(this.model.has("add")) {
            var add = this.model.get("add");
            this._addElement2Vessel(this.model.getEditing());
            this._showModelData();
            return true;
        }
        if(this.model.has("delete")) {
            var id = this.model.get("delete");
            this._deleteElement(id);
            this._showModelData();
            return true;
        }
        return false;
    }
});

LocalModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(LocalModel.superclass._defaultConfig.apply(this, arguments), {

        });
    },

    _init: function () {
        LocalModel.superclass._init.apply(this, arguments);
    },

    local: function () {
        if(this.has("add")) {
            this.get("add");
            var id = BI.UUID();
            this.set(id, "这是新增的属性:" + id);
            this.setEditing(id);
            return true;
        }
        if(this.has("delete")) {
            var id = this.get("delete");
            this.unset(id);
            return true;
        }
        return false;
    }

});

Demo.Func = BI.inherit(BI.Widget, {
    render: function () {
        var view = BI.View.createView("/local", {}, {
            element: this
        });
        view.populate();
    },

    mounted: function () {
    }
});
BI.shortcut("demo.local", Demo.Func);