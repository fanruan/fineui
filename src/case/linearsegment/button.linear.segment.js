BI.LinearSegmentButton = BI.inherit(BI.BasicButton, {

    props: {
        extraCls: "bi-line-segment-button bi-list-item-effect",
        once: true,
        readonly: true,
        hgap: 10,
        height: 24
    },

    render: function () {
        var self = this, o = this.options;

        return [{
            type: "bi.label",
            text: o.text,
            height: o.height,
            textHeight: o.height - 2,
            value: o.value,
            hgap: o.hgap,
            ref: function () {
                self.text = this;
            }
        }, {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.layout",
                    cls: "line-segment-button-line",
                    height: 2,
                    ref: function () {
                        self.line = this;
                    }
                },
                left: 0,
                right: 0,
                bottom: 0
            }]
        }];
    },

    setSelected: function (v) {
        BI.LinearSegmentButton.superclass.setSelected.apply(this, arguments);
        if (v) {
            this.line.element.addClass("bi-high-light-background");
        } else {
            this.line.element.removeClass("bi-high-light-background");
        }
    },

    setText: function (text) {
        this.text.setText(text);
    }
});
BI.shortcut("bi.linear_segment_button", BI.LinearSegmentButton);
