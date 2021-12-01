/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.Radio = BI.inherit(BI.BasicButton, {

    props: {
        baseCls: "bi-radio",
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
                type: "bi.layout",
                cls: "radio-content",
                ref: function (_ref) {
                    self.radio = _ref;
                },
                width: o.iconWidth,
                height: o.iconHeight
            }]
        };
    },

    _setEnable: function (enable) {
        BI.Radio.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.radio.element.removeClass("base-disabled disabled");
        } else {
            this.radio.element.addClass("base-disabled disabled");
        }
    },

    doClick: function () {
        BI.Radio.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.Radio.EVENT_CHANGE);
        }
    },

    setSelected: function (b) {
        BI.Radio.superclass.setSelected.apply(this, arguments);
        if (b) {
            this.radio.element.addClass("bi-high-light-background");
        } else {
            this.radio.element.removeClass("bi-high-light-background");
        }
    }
});
BI.Radio.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.radio", BI.Radio);
