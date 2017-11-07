;(function () {
    var model = Fix.define({
        name: "原始属性",
        arr: [{
            n: 'a'
        }, {
            n: 'b'
        }]
    });

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return model;
        },
        watch: {
            name: function () {
                this.button.setText(this.model.name)
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
                            self.model.name = "这是改变后的属性"
                        },
                        text: this.model.name
                    }
                }]
            }
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix1", Demo.Fix);
}());
