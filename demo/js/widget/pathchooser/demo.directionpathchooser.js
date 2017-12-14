


Demo.DirectionPathChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-direction-path-chooser"
    },

    render: function () {
        return {
            type: "bi.center_adapt",
            items: [
                {
                    type: "bi.direction_path_chooser",
                    items: [[{
                        region: "8c4460bc3605685e",
                        regionText: "采购订单XXX",
                        text: "ID",
                        value: "1"
                    }, {
                        region: "0fbd0dc648f41e97",
                        regionText: "采购订单",
                        text: "学号",
                        value: "3"
                    }, {
                        region: "c6d72d6c7e19a667",
                        regionText: "供应商基本信息",
                        text: "ID",
                        value: "5"
                    }], [{
                        region: "ed013e18cc7c8637",
                        regionText: "采购订单XXX",
                        text: "ID",
                        value: "1"
                    }, {
                        region: "153d75878431f8ee",
                        regionText: "A3",
                        text: "学号",
                        value: "2"
                    }, {
                        region: "3861fb024c7d7825",
                        regionText: "采购订单",
                        text: "学号",
                        value: "3"
                    }, {
                        region: "88e3e5071bd10bc5",
                        regionText: "供应商",
                        text: "ID",
                        value: "4"
                    }, {
                        region: "8476c77ab5c147e0",
                        regionText: "供应商基本信息",
                        text: "ID",
                        value: "5"
                    }], [{
                        region: "f00f67fbb9fba6fe",
                        regionText: "采购订单XXX",
                        text: "ID",
                        value: "1"
                    }, {
                        region: "1e8badf5d5793408",
                        regionText: "A3",
                        text: "学号",
                        value: "2"
                    }, {
                        region: "de1ebd3d0986a294",
                        regionText: "供应商基本信息",
                        text: "ID",
                        value: "5"
                    }]]
                }
            ]
        };
    }
});

BI.shortcut("demo.direction_path_chooser", Demo.DirectionPathChooser);