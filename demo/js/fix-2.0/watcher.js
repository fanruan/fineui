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
            "name||arr.1.n": function () {
                this.button.setText(this.model.name + "-" + this.model.arr[1].n)
            }
        },
        render: function () {
            var self = this;
            var cnt = 0;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.button",
                        ref: function () {
                            self.button = this;
                        },
                        handler: function () {
                            if (cnt & 1) {
                                self.model.name += 1;
                            } else {
                                self.model.arr[1].n += 1;
                            }
                            cnt++;
                        },
                        text: this.model.name + "-" + this.model.arr[1].n
                    }
                }]
            }
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix_watcher", Demo.Fix);
}());