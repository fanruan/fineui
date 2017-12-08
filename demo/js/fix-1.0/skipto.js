// skipTo 函数
SkipToView = BI.inherit(BI.View, {
    _defaultConfig: function () {
        return BI.extend(SkipToView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-skip-to"
        });
    },

    _init: function () {
        SkipToView.superclass._init.apply(this, arguments);
    },

    _createNav: function () {
        var self = this;
        var nav = BI.createWidget({
            type: "bi.button_group",
            cls: "top-nav",
            items: BI.createItems(this.model.get("items"), {
                type: "bi.text_button",
                height: 30,
                textAlign: "center",
                hgap: 20
            }),
            layouts: [{
                type: "bi.left",
                height: 40,
                vgap: 5,
                hgap: 3
            }]
        });
        nav.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.skipTo(this.getValue()[0], "pane", this.getValue()[0]);
        });
        return nav;
    },

    _createPane: function () {
        var pane = BI.createWidget({
            type: "bi.center",
            cls: "center-pane",
            height: 200
        });
        this.addSubVessel("pane", pane, {
            defaultShowName: "green"
        });
        return pane;
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.vertical",
            element: vessel,
            items: [this._createNav(), this._createPane()],
            vgap: 10,
            hgap: 10
        });
    },

    refresh: function () {
        this.skipTo("green", "pane", "green");
    }
});

SkipToModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(SkipToModel.superclass._defaultConfig.apply(this, arguments), {
            red: {
                text: "hotpink"
            }, blue: {
                text: "cornflowerblue"
            }, green: {
                text: "darkcyan"
            }, yellow: {
                text: "darkgoldenrod"
            }
        });
    },
    _static: function () {
        return {
            items: [{
                text: "hotpink",
                value: "red",
                cls: "red-pane mvc-button"
            }, {
                text: "cornflowerblue",
                value: "blue",
                cls: "blue-pane mvc-button"
            }, {
                text: "darkcyan",
                value: "green",
                cls: "green-pane mvc-button",
                selected: true
            }, {
                text: "darkgoldenrod",
                value: "yellow",
                cls: "yellow-pane mvc-button"
            }]
        };
    },

    _init: function () {
        SkipToModel.superclass._init.apply(this, arguments);
    }
});

// Red pane #FF69B4
SkipToRedView = BI.inherit(BI.View, {
    _init: function () {
        SkipToRedView.superclass._init.apply(this, arguments);
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.absolute",
            element: vessel,
            cls: "red-pane",
            items: [{
                el: {
                    type: "bi.label",
                    text: "Model Data: " + JSON.stringify(this.model.toJSON()),
                    hgap: 20,
                    height: 26
                }
            }]
        });
    }

});

SkipToRedModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(SetGetModel.superclass._defaultConfig.apply(this, arguments), {

        });
    },

    _init: function () {
        SkipToRedModel.superclass._init.apply(this, arguments);
    }
});

// Blue pane #6495ED
SkipToBlueView = BI.inherit(BI.View, {
    _init: function () {
        SkipToBlueView.superclass._init.apply(this, arguments);
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.absolute",
            element: vessel,
            cls: "blue-pane",
            items: [{
                el: {
                    type: "bi.label",
                    text: "Model Data: " + JSON.stringify(this.model.toJSON()),
                    hgap: 20,
                    height: 26
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    }
});

SkipToBlueModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(SetGetModel.superclass._defaultConfig.apply(this, arguments), {
        });
    },

    _init: function () {
        SkipToGreenModel.superclass._init.apply(this, arguments);
    }
});

// Dark green pane #008B8B
SkipToGreenView = BI.inherit(BI.View, {
    _init: function () {
        SkipToGreenView.superclass._init.apply(this, arguments);
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.absolute",
            element: vessel,
            cls: "green-pane",
            items: [{
                el: {
                    type: "bi.label",
                    text: "Model Data: " + JSON.stringify(this.model.toJSON()),
                    hgap: 20,
                    height: 26
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    }
});

SkipToGreenModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(SetGetModel.superclass._defaultConfig.apply(this, arguments), {
        });
    },

    _init: function () {
        SkipToGreenModel.superclass._init.apply(this, arguments);
    }
});

// Dark yellow pane #B8860B
SkipToYellowView = BI.inherit(BI.View, {
    _init: function () {
        SkipToYellowView.superclass._init.apply(this, arguments);
    },

    render: function (vessel) {
        BI.createWidget({
            type: "bi.absolute",
            element: vessel,
            cls: "yellow-pane",
            items: [{
                el: {
                    type: "bi.label",
                    text: "Model Data: " + JSON.stringify(this.model.toJSON()),
                    hgap: 20,
                    height: 26
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    }
});

SkipToYellowModel = BI.inherit(BI.Model, {
    _defaultConfig: function () {
        return BI.extend(SetGetModel.superclass._defaultConfig.apply(this, arguments), {
        });
    },

    _init: function () {
        SkipToYellowModel.superclass._init.apply(this, arguments);
    }
});

Demo.Func = BI.inherit(BI.Widget, {
    render: function () {
        var view = BI.View.createView("/skipTo", {}, {
            element: this
        });
        view.populate();
    },

    mounted: function () {
    }
});
BI.shortcut("demo.skipTo", Demo.Func);
