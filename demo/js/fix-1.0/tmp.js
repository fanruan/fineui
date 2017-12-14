TmpView = BI.inherit(BI.View, {
    _defaultConfig: function () {
        return BI.extend(TmpView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tmp"
        });
    },

    _init: function () {
        TmpView.superclass._init.apply(this, arguments);
    },

    change: function (changed) {
        if(changed.data1) {
            this._showModelData();
        }
    },

    _showModelData: function () {
        this.text.setText("父级Model层数据为：" + JSON.stringify(this.model.toJSON()));
    },

    _createMain: function () {
        var self = this;
        return BI.createWidget({
            type: "bi.border",
            items: {
                west: {
                    el: {
                        type: "bi.vertical",
                        vgap: 10,
                        items: [{
                            el: (this.text = BI.createWidget({
                                type: "bi.label",
                                whiteSpace: "normal"
                            }))
                        }, {
                            el: {
                                type: "bi.text_button",
                                cls: "tmp-button mvc-button",
                                text: "点击触发事件tmp('data1', {child: {type: {value: \"临时数据\"}}})",
                                height: 30,
                                handler: function () {
                                    self.model.tmp("data1", {
                                        child: {
                                            type: {
                                                value: "临时数据"
                                            }
                                        }
                                    });
                                }
                            }
                        }, {
                            el: {
                                type: "bi.text_button",
                                cls: "tmp-button mvc-button",
                                text: "点击触发事件submit",
                                height: 30,
                                handler: function () {
                                    self.model.submit();
                                }
                            }
                        }, {
                            el: {
                                type: "bi.text_button",
                                cls: "tmp-button mvc-button",
                                text: "点击跳转到右方",
                                height: 30,
                                handler: function () {
                                    self.addSubVessel("test", self.center).skipTo("child", "test", "data1");
                                }
                            }
                        }]
                    },
                    width: 200
                },
                center: {
                    el: (this.center = BI.createWidget())
                }
            }
        });
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.center",
            element: vessel,
            items: [{
                el: this._createMain()
            }],
            hgap: 50,
            vgap: 100
        });
    },

    refresh: function () {
        this._showModelData();
    }
});

TmpModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(TmpModel.superclass._defaultConfig.apply(this, arguments), {
            data1: {
                child: {
                    type: {
                        value: "这是一个测试数据"
                    }
                }
            },
            data2: "test"
        });
    },

    _init: function () {
        TmpModel.superclass._init.apply(this, arguments);
    }

});

TmpChildView = BI.inherit(BI.View, {
    _defaultConfig: function () {
        return BI.extend(TmpChildView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tmp-child"
        });
    },

    _init: function () {
        TmpChildView.superclass._init.apply(this, arguments);
    },

    change: function (changed) {
        if(changed.child) {
            this._showModelData();
        }
    },

    _showModelData: function () {
        this.text.setText("子级Model层数据为：" + JSON.stringify(this.model.toJSON()));
    },

    _createMain: function () {
        var self = this;
        return BI.createWidget({
            type: "bi.border",
            items: {
                west: {
                    el: {
                        type: "bi.vertical",
                        vgap: 10,
                        items: [{
                            el: (this.text = BI.createWidget({
                                type: "bi.label",
                                whiteSpace: "normal"
                            }))
                        }, {
                            el: {
                                type: "bi.text_button",
                                cls: "tmp-button mvc-button",
                                text: "点击触发事件set",
                                height: 30,
                                handler: function () {
                                    self.set("child", {
                                        type: {
                                            value: "值改变了"
                                        }
                                    });
                                }
                            }
                        }, {
                            el: {
                                type: "bi.text_button",
                                cls: "tmp-button mvc-button",
                                text: "点击跳转到右方",
                                height: 30,
                                handler: function () {
                                    self.addSubVessel("test", self.center).skipTo("child", "test", "child");
                                }
                            }
                        }]
                    },
                    width: 200
                },
                center: {
                    el: (this.center = BI.createWidget())
                }
            }
        });
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.center",
            element: vessel,
            items: [{
                el: this._createMain()
            }],
            hgap: 50
        });
    },

    refresh: function () {
        this._showModelData();
    }
});

TmpChildModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(TmpChildModel.superclass._defaultConfig.apply(this, arguments), {

        });
    },

    _init: function () {
        TmpChildModel.superclass._init.apply(this, arguments);
    }

});
TmpChildChildView = BI.inherit(BI.View, {
    _defaultConfig: function () {
        return BI.extend(TmpChildChildView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tmp-child-child"
        });
    },

    _init: function () {
        TmpChildChildView.superclass._init.apply(this, arguments);
    },

    change: function (changed) {
        if(changed.type) {
            this._showModelData();
        }
    },

    _showModelData: function () {
        this.text.setText("叶节点数据为：" + JSON.stringify(this.model.toJSON()));
    },

    _createMain: function () {
        return (this.text = BI.createWidget({
            type: "bi.label",
            whiteSpace: "normal"
        }));
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.center",
            element: vessel,
            items: [{
                el: this._createMain()
            }],
            hgap: 50
        });
    },

    refresh: function () {
        this._showModelData();
    }
});

TmpChildChildModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(TmpChildChildModel.superclass._defaultConfig.apply(this, arguments), {

        });
    },

    _init: function () {
        TmpChildChildModel.superclass._init.apply(this, arguments);
    }

});

Demo.Func = BI.inherit(BI.Widget, {
    render: function () {
        var view = BI.View.createView("/tmp", {}, {
            element: this
        });
        view.populate();
    },

    mounted: function () {
    }
});
BI.shortcut("demo.tmp", Demo.Func);
