/**
 * 专门为calendar的视觉加的button，作为私有button,不能配置任何属性，也不要用这个玩意
 */
BI.CalendarDateItem = BI.inherit(BI.BasicButton, {
    props: function() {
        return {
            height: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT + 8,
        } 
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.text_item",
                    cls: "bi-border-radius bi-list-item-select",
                    textAlign: "center",
                    whiteSpace: "normal",
                    text: o.text,
                    value: o.value,
                    ref: function () {
                        self.text = this;
                    }
                },
                left: o.lgap,
                right: o.rgap,
                top: o.tgap,
                bottom: o.bgap
            }]
        };
    },

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    setSelected: function (b) {
        BI.CalendarDateItem.superclass.setSelected.apply(this, arguments);
        this.text.setSelected(b);
    },

    getValue: function () {
        return this.text.getValue();
    }
});
BI.shortcut("bi.calendar_date_item", BI.CalendarDateItem);
