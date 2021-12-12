if (this.importScripts) {
    importScripts("https://fanruan.design/fineui/fineui_without_jquery_polyfill.js");
    BI.useInWorker();
}
var Model = BI.inherit(Fix.Model, {
    state: function () {
        return {
            count: 0
        };
    },

    computed: {
        name: function () {
            return this.getText(this.model.count);
        }
    },

    actions: {
        addCount: function () {
            this.model.count += 1;
        }
    },

    getText (count) {
        return "被点击了" + count + "次";
    }
});

BI.model("demo.model", Model);
