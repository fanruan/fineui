!(function () {
    BI.TimeTrigger = BI.inherit(BI.Trigger, {
        props: {
            extraCls: "bi-time-trigger",
            height: 22,
            width: 80,
            value: {}
        },
        render: function () {
            var self = this, o = this.options;
            return {
                type: "bi.htape",
                items: [{
                    el: {
                        type: "bi.label",
                        textAlign: "left",
                        height: o.height,
                        width: o.width,
                        text: this._formatValue(o.value),
                        ref: function (_ref) {
                            self.text = _ref;
                        }
                    },
                    hgap: 4
                }]
            };
        },

        setValue: function (v) {
            this.text.setText(this._formatValue(v));
        },

        _formatValue: function (v) {
            var now = BI.getDate();
            return BI.isNotEmptyObject(v) ? BI.print(BI.getDate(now.getFullYear(), now.getMonth(), now.getDay(), v.hour, v.minute, v.second), "%H:%M:%S") : BI.i18nText("BI-Basic_Unrestricted");
        }

    });
    BI.shortcut("bi.time_trigger", BI.TimeTrigger);
})();