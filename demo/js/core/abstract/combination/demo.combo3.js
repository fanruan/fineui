Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createEl: function () {
        return {
            type: "bi.label",
            cls:"bi-border",
            height: "100%",
            text: "点击"
        };
    },

    oneCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            direction: "right,innerRight",
            isNeedAdjustWidth: false,
            isNeedAdjustHeight: false,
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    width: 200,
                    height: 200
                }
            }
        });
    },

    twoCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            direction: "right,innerRight",
            isNeedAdjustWidth: false,
            isNeedAdjustHeight: false,
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    width: 1000,
                    height: 200
                }
            }
        });
    },

    threeCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            direction: "right,innerRight",
            isNeedAdjustWidth: false,
            isNeedAdjustHeight: false,
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    width: 400,
                    height: 200
                }
            }
        });
    },

    render: function () {
        return {
            type: "bi.grid",
            hgap: 10,
            vgap: 5,
            items: [[this.oneCombo()], [this.twoCombo()], [this.threeCombo()]]
        };
    }
});
BI.shortcut("demo.combo3", Demo.Func);