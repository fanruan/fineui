(function () {
    var ParentStore = BI.inherit(Fix.Model, {
        state: function () {
            return {
                context: {
                    one: {
                        key: "one.key"
                    }
                }
            };
        },
        childContext: ["context"]
    });

    BI.model("demo.model.inject.parent_store", ParentStore);

    var ChildStore = BI.inherit(Fix.Model, {
        inject: ["context"],
        computed: {
            currContext: function () {
                return this.model.context.one.key;
            }
        },
        actions: {
            changeContext: function () {
                this.model.context = {
                    two: {
                        key: "two.key"
                    }
                };
            }
        }
    });

    BI.model("demo.model.inject.child_store", ChildStore);

    var Child = BI.inherit(BI.Widget, {
        _store: function () {
            return BI.Models.getModel("demo.model.inject.child_store");
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
                text: this.model.currContext,
                handler: function () {
                    self.store.changeContext();
                }
            };
        },
        mounted: function () {

        }
    });

    BI.shortcut("demo.fix_inject_child", Child);

    var Parent = BI.inherit(BI.Widget, {
        _store: function () {
            return BI.Models.getModel("demo.model.inject.parent_store");
        },
        render: function () {
            var self = this;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "demo.fix_inject_child"
                    }
                }]
            };
        },
        mounted: function () {

        }
    });

    BI.shortcut("demo.fix_inject", Parent);
}());
