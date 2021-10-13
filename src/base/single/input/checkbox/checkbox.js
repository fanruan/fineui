/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.Checkbox = BI.inherit(BI.BasicButton, {

    props: {
        baseCls: "bi-checkbox",
        selected: false,
        handler: BI.emptyFn,
        width: 14,
        height: 14,
        iconWidth: 14,
        iconHeight: 14
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.center_adapt",
            items: [{
                type: "bi.default",
                ref: function (_ref) {
                    self.checkbox = _ref;
                },
                cls: "checkbox-content",
                width: o.iconWidth,
                height: o.iconHeight
            }]
        };
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
            this.checkbox.element.addClass("bi-high-light-background");
        } else {
            this.checkbox.element.removeClass("bi-high-light-background");
        }
    }
});
BI.Checkbox.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.checkbox", BI.Checkbox);
