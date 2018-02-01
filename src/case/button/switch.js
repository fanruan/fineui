/**
 * Created by Windy on 2018/2/1.
 */
BI.Switch = BI.inherit(BI.BasicButton, {

    props: {
        extraCls: "bi-switch",
        height: 22,
        width: 44,
        logic: {
            dynamic: false
        }
    },

    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            ref: function () {
                self.layout = this;
            },
            items: [{
                el: {
                    type: "bi.text_button",
                    cls: "circle-button bi-card"
                },
                width: 18,
                height: 18,
                top: 2,
                left: this.options.selected ? 24 : 2
            }]
        }
    },

    setSelected: function (v) {
        BI.Switch.superclass.setSelected.apply(this, arguments);
        this.layout.attr("items")[0].left = v ? 24 : 2;
        this.layout.resize();
    },

    doClick: function () {
        BI.Switch.superclass.doClick.apply(this, arguments);
        this.fireEvent(BI.Switch.EVENT_CHANGE);
    }
});
BI.Switch.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.switch", BI.Switch);