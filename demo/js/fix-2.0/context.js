(function () {
    var ParentStore = BI.inherit(Fix.Model, {
        state: function () {
            return {
                context: "默认context"
            };
        },
        childContext: ["context"]
    });

    BI.model("demo.model.context.parent_store",ParentStore)

    var ChildStore = BI.inherit(Fix.Model, {
        context: ["context"],
        computed: {
            currContext: function () {
                return this.model.context;
            }
        },
        actions: {
            changeContext: function () {
                this.model.context = "改变后的context";
            }
        }
    });

    BI.model("demo.model.context.child_store",ChildStore)

    var Child = BI.inherit(BI.Widget, {
        _store: function () {
            return BI.Models.getModel("demo.model.context.child_store");
        },
        watch: {
            currContext: function (val) {
                this.button.setText(val);
            }
        },
        render: function () {
            var self = this;
            return {
                type: "bi.button",
                ref: function () {
                    self.button = this;
                },
                text: this.model.context,
                handler: function () {
                    self.store.changeContext();
                }
            };
        },
        mounted: function () {

        }
    });

    BI.shortcut("demo.fix_context_child", Child);

    var Parent = BI.inherit(BI.Widget, {
        _store: function () {
            return BI.Models.getModel("demo.model.context.parent_store");
        },
        render: function () {
            var self = this;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "demo.fix_context_child"
                    }
                }]
            };
        },
        mounted: function () {

        }
    });

    BI.shortcut("demo.fix_context", Parent);
}());
