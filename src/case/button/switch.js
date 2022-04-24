/**
 * Created by Windy on 2018/2/1.
 */
BI.Switch = BI.inherit(BI.BasicButton, {

    constants: {
        CIRCLE_SIZE: 12
    },

    props: {
        extraCls: "bi-switch",
        attributes: {
            tabIndex: 1
        },
        height: 20,
        width: 44,
        logic: {
            dynamic: false
        },
        showTip: false
    },

    render: function () {
        var self = this, o = this.options, c = this.constants;
        var tgap = (o.height - c.CIRCLE_SIZE) / 2;
        return {
            type: "bi.absolute",
            ref: function () {
                self.layout = this;
            },
            items: [{
                el: {
                    type: "bi.text_button",
                    cls: "circle-button"
                },
                width: 12,
                height: 12,
                top: tgap,
                left: this.options.selected ? 28 : 4
            }, {
                type: "bi.label",
                text: BI.i18nText("BI-Basic_Open"),
                cls: "content-tip",
                left: 8,
                top: tgap - 2,
                invisible: !o.showTip,
                ref: function (ref) {
                    self.openTip = ref;
                }
            }, {
                type: "bi.label",
                text: BI.i18nText("BI-Basic_Close"),
                cls: "content-tip",
                right: 8,
                top: tgap - 2,
                invisible: !o.showTip,
                ref: function (ref) {
                    self.closeTip = ref;
                }
            }]
        };
    },

    _setEnable: function (enable) {
        BI.Switch.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.element.attr("tabIndex", 1);
        } else if (enable === false) {
            this.element.removeAttr("tabIndex");
        }
    },

    setSelected: function (v) {
        BI.Switch.superclass.setSelected.apply(this, arguments);
        this.layout.attr("items")[0].left = v ? 28 : 4;
        this.layout.resize();
        this.options.showTip && this.openTip.setVisible(v);
        this.options.showTip && this.closeTip.setVisible(!v);
    },

    doClick: function () {
        BI.Switch.superclass.doClick.apply(this, arguments);
        this.fireEvent(BI.Switch.EVENT_CHANGE);
    }
});
BI.Switch.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.switch", BI.Switch);
