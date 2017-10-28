//splice和duplicate函数
SpliceDuplicateView = BI.inherit(BI.View, {
    _defaultConfig: function () {
        return BI.extend(SpliceDuplicateView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-splice-duplicate"
        })
    },

    _init: function () {
        SpliceDuplicateView.superclass._init.apply(this, arguments);
        this.children = {};
    },

    splice: function (old, key1, key2) {
        this.children[key1].destroy();
        delete this.children[key1];
        this._showModelData();
    },

    duplicate: function (copy, key1, key2) {
        this.add(copy);
        this._showModelData();
    },

    _showModelData: function () {
        //这里只是为了输出this.model.data   原则上是不允许这么调用的
        this.text.setText("父级数据：" + JSON.stringify(this.model.data));
    },

    render: function (vessel) {
        this.text = BI.createWidget({
            type: "bi.label",
            height: 50,
            cls: "superiors-label"
        });
        this.container = BI.createWidget({
            type: "bi.vertical",
            element: vessel,
            items: [this.text],
            hgap: 100,
            vgap: 10
        });
        this._showModelData();
    },

    add: function (id) {
        this.children[id] = BI.createWidget({
            type: "bi.center",
            hgap: 10,
            vgap: 10
        });
        this.addSubVessel(id, this.children[id], {
            defaultShowName: "sdSub"
        });
        this.skipTo("sdSub", id, id);
        this.container.addItem(this.children[id]);
    },

    refresh: function () {
        var self = this;
        BI.each(this.model.toJSON(), function (key, value) {
            if (!self.children[key]) {
                self.add(key);
            }
        })
    }
});

SpliceDuplicateModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(SpliceDuplicateModel.superclass._defaultConfig.apply(this, arguments), {
            "1": {
                name: "名字"
            }
        })
    },

    splice: function (key1) {
        delete this.data[key1];
    },

    similar: function (value, key1) {
        value.name = BI.Func.createDistinctName(this.data, this.get(key1).name);
        return value;
    },

    duplicate: function (copy, key1) {
        this.data[copy] = this.get(copy);
    },

    _init: function () {
        SpliceDuplicateModel.superclass._init.apply(this, arguments);
    },

    refresh: function () {
        this.data = BI.deepClone(this.toJSON());
    }
});

SDSubView = BI.inherit(BI.View, {
    _defaultConfig: function () {
        return SDSubView.superclass._defaultConfig.apply(this, arguments);
    },

    _init: function () {
        SDSubView.superclass._init.apply(this, arguments);
    },

    render: function (vessel) {
        var self = this;
        BI.createWidget({
            type: "bi.center",
            element: vessel,
            cls: "sd-child",
            height: 30,
            items: [{
                type: "bi.text_button",
                height: 30,
                text: "复制  " + this.model.get("name") + " , 数据：" + JSON.stringify(this.model.toJSON()),
                cls: "right-button-add",
                handler: function () {
                    self.model.copy();
                }
            }, {
                type: "bi.text_button",
                height: 30,
                text: "删除",
                cls: "right-button-del",
                handler: function () {
                    self.model.destroy();
                }
            }]
        })
    }
});

SDSubModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(SDSubModel.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        SDSubModel.superclass._init.apply(this, arguments);
    }
});

Demo.Func = BI.inherit(BI.Widget, {
    render: function () {
        var view = BI.View.createView("/spliceDuplicate", {}, {
            element: this
        });
        view.populate();
    },

    mounted: function () {
    }
});
BI.shortcut("demo.spliceDuplicate", Demo.Func);
