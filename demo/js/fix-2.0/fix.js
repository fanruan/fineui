Demo.Store = BI.inherit(Fix.VM, {
    computed: {
        b: function () {
            return this.model.name + 1
        },
        c: function () {
            return this.model.name + this.model.b
        }
    },
    methods: {
        run: function () {
            this.model.name = 2;
        }
    }
});
var model = new Fix.Observer({
    name: 1,
    arr: [{
        n: 'a'
    }, {
        n: 'b'
    }]
}).model;
Demo.Fix = BI.inherit(BI.Widget, {
    _store: function () {
        return new Demo.Store(model);
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