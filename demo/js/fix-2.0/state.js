;(function () {
    var State = BI.inherit(Fix.Model, {
        state: function () {
            return {
                name: "原始属性"
            }
        },
        computed: {
            b: function () {
                return this.model.name + "-计算属性"
            }
        }
    })

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return new State();
        },
        watch: {
            b: function () {
                this.button.setText(this.model.b)
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
                        text: this.model.b
                    }
                }]
            }
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix6", Demo.Fix);
}());