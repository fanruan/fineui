;(function () {
    var model = Fix.define({
        name: 1,
        arr: [{
            n: 'a'
        }, {
            n: 0
        }]
    });
    var Computed = BI.inherit(Fix.VM, {
        computed: {
            b: function () {
                return this.name + 1
            },
            c: function () {
                return this.arr[1].n + this.b
            }
        }
    })

    var Store = BI.inherit(Fix.VM, {
        _init: function () {
            this.comp = new Computed(model);
        },
        computed: {
            b: function () {
                return this.comp.c + 1
            },
            c: function () {
                return this.comp.arr[1].n & 1;
            }
        },
        actions: {
            run: function () {
                this.comp.name++;
                this.comp.arr[1].n++;
            }
        }
    });

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return new Store();
        },
        watch: {
            "b&&(c||b)": function () {
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
                            self.store.run()
                        },
                        text: this.model.b
                    }
                }]
            }
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix", Demo.Fix);
}());