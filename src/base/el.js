/**
 * 表示当前对象
 *
 * Created by GUY on 2015/9/7.
 * @class BI.EL
 * @extends BI.Widget
 */
BI.EL = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.EL.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-el",
            el: {},
            layout: {}
        });
    },
    _init: function () {
        BI.EL.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.ele = BI.createWidget(o.el);
        BI.createWidget(o.layout, {
            type: "bi.adaptive",
            element: this.element,
            items: [this.ele]
        });
        this.ele.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        })
    },

    setValue: function (v) {
        this.ele.setValue(v);
    },

    getValue: function () {
        return this.ele.getValue();
    },

    populate: function () {
        this.ele.populate.apply(this, arguments);
    }
});
$.shortcut('bi.el', BI.EL);