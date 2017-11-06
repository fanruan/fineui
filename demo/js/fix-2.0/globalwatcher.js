;(function () {
    var model = Fix.define({
        name: "原始属性",
        arr: [{
            n: 'a'
        }, {
            n: 0
        }]
    });

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return model;
        },
        watch: {
            "*.*.n": function () {
                debugger
            },
            "arr.**": function () {
                debugger
            },
            "arr.1.*": function () {
                this.button.setText(this.model.name + "-" + this.model.arr[1].n)
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
                            self.model.arr[0].n += 1;
                            self.model.arr[1].n += 1;
                        },
                        text: this.model.name + "-" + this.model.arr[1].n
                    }
                }]
            }
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix5", Demo.Fix);
}());