Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createEl: function () {
        return {
            type: "bi.button",
            height: 25,
            text: "点击"
        }
    },

    oneCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustLength: 5,
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    height: 500
                },
                maxHeight: 400
            }
        });
    },

    twoCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "bottom,left",
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    height: 1200
                }
            }
        });
    },

    threeCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustYOffset: 5,
            el: this._createEl(),
            isNeedAdjustHeight: false,
            popup: {
                el: {
                    type: "bi.layout",
                    height: 1200
                }
            }
        });
    },

    fourCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "left",
            el: this._createEl(),
            isNeedAdjustHeight: true,
            popup: {
                el: {
                    type: "bi.layout",
                    height: 1200
                }
            }
        })
    },

    fiveCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "left,top",
            el: this._createEl(),
            isNeedAdjustHeight: true,
            popup: {
                el: {
                    type: "bi.layout",
                    height: 1200
                },
                maxHeight: 2000
            }
        })
    },

    sixCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "top,left",
            el: this._createEl(),
            isNeedAdjustHeight: true,
            popup: {
                el: {
                    type: "bi.layout",
                    height: 1200
                }
            }
        })
    },

    sevenCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "bottom",
            isNeedAdjustWidth: false,
            //isNeedAdjustHeight: false,
            offsetStyle: "center",
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    width: 200,
                    height: 1200
                }
            }
        })
    },

    eightCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "right",
            isNeedAdjustWidth: false,
            //isNeedAdjustHeight: false,
            offsetStyle: "middle",
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    width: 200,
                    height: 200
                }
            }
        })
    },

    render: function () {
        return {
            type: "bi.grid",
            hgap: 10,
            vgap: 5,
            items: [[this.oneCombo(), this.twoCombo(), this.threeCombo()],
                [this.fourCombo(), this.fiveCombo(), this.sixCombo()],
                [this.sevenCombo(), this.eightCombo()]]
        };
    }
});
BI.shortcut("demo.combo2", Demo.Func);