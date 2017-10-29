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
            return this.name + this.b
        }
    }
})

Demo.Store = BI.inherit(Fix.VM, {
    _init: function () {
        this.computed = new Demo.Computed(model).model;
    },
    computed: {
        b: function () {
            return this.computed.c + 1
        },
    },
    methods: {
        run: function () {
            var t = this.model.b;
            this.computed.name = 2;
        }
    }
});

Demo.Fix = BI.inherit(BI.Widget, {
    _store: function () {
        return new Demo.Store();
    },
    watch: {
        b: function () {
            debugger;
        }
    },
    mounted: function () {

        this.store.run()
    }
});

BI.shortcut("demo.fix", Demo.Fix);