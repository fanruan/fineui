(function () {
    var model = Fix.define({
        name: "原始属性",
        arr: [{
            n: "a"
        }, {
            n: "b"
        }]
    });

    var Store = BI.inherit(Fix.Model, {
        _init: function () {
        },
        computed: {
            b: function () {
                return model.name + "-计算属性";
            }
        },
        actions: {
            run: function () {
                model.name = "这是改变后的属性";
            }
        }
    });

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return new Store();
        },
        watch: {
            b: function () {
                this.button.setText(this.model.b);
            }
        },
        render: function () {
            var self = this;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.button",
                        ref: function () {
                            self.button = this;
                        },
                        handler: function () {
                            self.store.run();
                        },
                        text: this.model.b
                    }
                }]
            };
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix_store", Demo.Fix);
}());