var model = Fix.define({
    name: 1,
    arr: [{
        n: 'a'
    }, {
        n: 'b'
    }]
});
Demo.Computed = BI.inherit(Fix.VM, {
    computed: {
        b: function () {
            return this.name + 1
        },
        c: function () {
            return this.arr[1].n + this.b
        }
    }
})

Demo.Store = BI.inherit(Fix.VM, {
    _init: function () {
        this.comp = new Demo.Computed(model).model;
    },
    computed: {
        b: function () {
            return this.comp.c + 1
        },
        c: function () {
            return this.comp.name
        }
    },
    actions: {
        run: function () {
            this.comp.name = 2;
            this.comp.arr[1].n = "c"
        }
    }
});

Demo.Fix = BI.inherit(BI.Widget, {
    _store: function () {
        return new Demo.Store();
    },
    watch: {
        "b&&c||b": function () {
            debugger;
        }
    },
    mounted: function () {

        this.store.run()
    }
});

BI.shortcut("demo.fix", Demo.Fix);