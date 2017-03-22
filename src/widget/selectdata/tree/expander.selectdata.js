/**
 * 字段列表展开Expander
 *
 * Created by GUY on 2015/9/14.
 * @class BI.SelectDataExpander
 * @extends BI.Widget
 */
BI.SelectDataExpander = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataExpander.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-expander",
            el: {},
            popup: {
                items: [],
                itemsCreator: BI.emptyFn
            }
        });
    },

    _init: function () {
        BI.SelectDataExpander.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el);
        this.expander = BI.createWidget({
            type: "bi.expander",
            element: this,
            isDefaultInit: false,
            el: this.trigger,
            popup: BI.extend({
                type: "bi.select_data_loader"
            }, o.popup)
        });
        this.expander.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.expander.on(BI.Expander.EVENT_EXPAND, function(){

        });
        this.expander.on(BI.Expander.EVENT_COLLAPSE, function(){
            this.getView().hideView();
        });
        this.expander.on(BI.Expander.EVENT_AFTER_INIT, function () {
            this.getView().populate();
        });
        this.expander.on(BI.Expander.EVENT_CHANGE, function () {
            self.trigger.setValue(this.getValue());
        });
    },

    setEnable: function (v) {
        BI.SelectDataExpander.superclass.setEnable.apply(this, arguments)
        this.expander.setEnable(v);
        this.trigger.setEnable(v)
    },

    doBehavior: function () {
        this.trigger.doRedMark.apply(this.trigger, arguments);
        this.expander.doBehavior.apply(this.expander, arguments);
    },

    setValue: function (v) {
        this.expander.setValue(v);
    },

    getValue: function () {
        return this.expander.getValue();
    },

    showView: function(b){
        this.expander.showView();
    },

    hideView: function(){
        this.expander.hideView();
    },

    isExpanded: function () {
        return this.expander.isExpanded();
    },

    getAllLeaves: function () {
        return this.expander.getAllLeaves();
    },

    getNodeById: function (id) {
        return this.expander.getNodeById(id);
    },

    getNodeByValue: function (value) {
        return this.expander.getNodeByValue(value);
    }
});
$.shortcut("bi.select_data_expander", BI.SelectDataExpander);