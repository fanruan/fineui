/**
 * 表示当前对象
 *
 * Created by GUY on 2015/9/7.
 * @class BI.EL
 * @extends BI.Widget
 */
BI.Context = BI.inherit(BI.Widget, {
    props: {
        context: "",
        watch: {},
        el: {},
        items: []
    },

    render: function () {
        var self = this, o = this.options;
        this.context = BI.createWidget(o.items[0] || o.el, {
            element: this
        });
        this.context.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    created: function () {
        var o = this.options;
        if (o.context) {
            BI.watch(o.context, o.watch);
        }
    },

    setValue: function (v) {
        this.context.setValue(v);
    },

    getValue: function () {
        return this.context.getValue();
    },

    populate: function () {
        this.context.populate.apply(this, arguments);
    }
});
BI.shortcut("bi.context", BI.Context);
