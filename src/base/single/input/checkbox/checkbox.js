/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.Checkbox = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.Checkbox.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-checkbox",
            selected: false,
            handler: BI.emptyFn,
            width: 16,
            height: 16,
            iconWidth: 14,
            iconHeight: 14
        });
    },

    _init: function () {
        BI.Checkbox.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        BI.createWidget({
            type: "bi.center_adapt",
            element: this.element,
            items: [{
                type: "bi.default",
                ref: function (_ref) {
                    self.checkbox = _ref;
                },
                cls: "checkbox-context bi-border",
                width: o.iconWidth,
                height: o.iconHeight
            }]
        });
    },

    _setEnable: function (enable) {
        BI.Checkbox.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.checkbox.element.removeClass("base-disabled disabled");
        } else {
            this.checkbox.element.addClass("base-disabled disabled");
        }
    },

    doClick: function () {
        BI.Checkbox.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.Checkbox.EVENT_CHANGE);
        }
    },

    setSelected: function (b) {
        BI.Checkbox.superclass.setSelected.apply(this, arguments);
        if (b) {
            this.checkbox.element.removeClass("bi-border").addClass("bi-high-light-background bi-high-light-border");
        } else {
            this.checkbox.element.removeClass("bi-high-light-background bi-high-light-border").addClass("bi-border");
        }
    }
});
BI.Checkbox.EVENT_CHANGE = "Checkbox.EVENT_CHANGE";

BI.shortcut("bi.checkbox", BI.Checkbox);