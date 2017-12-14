/**
 * Created by User on 2017/3/22.
 */
Demo.PathChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-path-chooser"
    },
    render: function () {
        var pathchooser = BI.createWidget({
            type: "bi.path_chooser",
            width: 800,
            height: 400,
            items: //    [
            //    [{region: "区域X", value: "X1"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E"},
            //        {region: "区域G", value: "G"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域C", value: "C"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E"},
            //        {region: "区域G", value: "G"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        //{region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域C", value: "C"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E"},
            //        {region: "区域G", value: "G"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E1"},
            //        {region: "区域H", value: "H"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域C", value: "C"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E1"},
            //        {region: "区域H", value: "H"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域C", value: "C"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E1"},
            //        {region: "区域H", value: "H"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域F", value: "F"},
            //        {region: "区域H", value: "H"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域C", value: "C"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域F", value: "F"},
            //        {region: "区域H", value: "H"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X", text: "X"},
            //        {region: "区域Q", value: "Q", text: "Q"},
            //        {region: "区域A", value: "A", text: "A"},
            //        {region: "区域C", value: "C", text: "C"},
            //        {region: "区域D", value: "D", text: "D"},
            //        {region: "区域F", value: "F", text: "F"},
            //        {region: "区域H", value: "H", text: "H"},
            //        {region: "区域I", value: "I", text: "I"},
            //        {region: "区域J", value: "J", text: "J"}]
            // ]
                [[{
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
        });
        pathchooser.setValue();
        return {
            type: "bi.absolute",
            items: [{
                el: pathchooser,
                left: 100,
                top: 100
            }, {
                el: {
                    type: "bi.button",
                    text: "getValue",
                    handler: function () {
                        BI.Msg.toast(JSON.stringify(pathchooser.getValue()));
                    }
                },
                left: 100,
                bottom: 10
            }]
        };
    }
});
BI.shortcut("demo.path_chooser", Demo.PathChooser);