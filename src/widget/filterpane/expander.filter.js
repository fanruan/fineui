/**
 * @class BI.FilterExpander
 * @extend BI.AbstractFilterItem
 * 过滤树的一个expander节点
 */
BI.FilterExpander = BI.inherit(BI.AbstractFilterItem, {

    _constant: {
        EXPANDER_WIDTH: 20
    },

    _defaultConfig: function () {
        var conf = BI.FilterExpander.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-filter-expander",
            el: {},
            popup: {}
        })
    },

    _init: function () {
        BI.FilterExpander.superclass._init.apply(this, arguments);
        this._initExpander();
        this._initConditionsView();
        BI.createWidget({
            type: "bi.horizontal_adapt",
            element: this,
            items: [this.expander, this.conditionsView]
        });
    },

    _initExpander: function () {
        var self = this, o = this.options;
        var value = o.value, text = "";
        if (value === BICst.FILTER_TYPE.AND) {
            text = BI.i18nText("BI-Basic_And");
        } else {
            text = BI.i18nText("BI-Basic_Or");
        }
        this.expander = BI.createWidget({
            type: "bi.text_button",
            cls: "condition-and-or",
            text: text,
            value: value,
            id: o.id,
            width: this._constant.EXPANDER_WIDTH,
            height: "100%"
        });
        this.expander.on(BI.Controller.EVENT_CHANGE, function (type) {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    _initConditionsView: function () {
        var self = this, popup = this.options.popup;
        this.conditionsView = BI.createWidget(popup);
        this.conditionsView.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    getValue: function () {
        return {
            type: this.expander.getValue(),
            value: this.conditionsView.getValue(),
            id: this.options.id
        };
    },

    setValue: function () {

    },

    populate: function (items) {
        this.conditionsView.populate.apply(this.conditionsView, arguments);
    }
});
$.shortcut("bi.filter_expander", BI.FilterExpander);