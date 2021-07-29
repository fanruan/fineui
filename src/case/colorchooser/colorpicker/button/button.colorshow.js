/**
 * @author windy
 * @version 2.0
 * Created by windy on 2021/7/28
 */
BI.ColorChooserShowButton = BI.inherit(BI.BasicButton, {

    props: {
        baseCls: 'bi-color-chooser-show-button bi-border bi-list-item-effect',
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: 'bi.htape',
            items: [{
                el: {
                    type: "bi.icon_label",
                    ref: function (_ref) {
                        self.icon = _ref;
                    },
                    iconWidth: 16,
                    iconHeight: 16,
                },
                hgap: 20,
                width: 16,
            }, {
                type: 'bi.label',
                textAlign: 'left',
                text: o.text,
            }]
        }
    },

    doClick: function () {
        BI.ColorChooserShowButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.ColorChooserShowButton.EVENT_CHANGE, this);
        }
    },
});
BI.ColorChooserShowButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.color_picker_show_button", BI.ColorChooserShowButton);