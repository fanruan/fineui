(function () {
    var ParentStore = BI.inherit(Fix.Model, {
        state: function () {
            return {
                context: "默认context"
            };
        },
        childContext: ["context"]
    });

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

    var Child = BI.inherit(BI.Widget, {
        _store: function () {
            return new ChildStore();
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
            return new ParentStore();
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