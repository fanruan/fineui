/**
 * Created by User on 2017/3/22.
 */
Demo.RelationView = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-relation-view"
    },
    render: function () {
        var relationview = BI.createWidget({
            type: "bi.relation_view",
            items: [
                {
                    primary: {
                        region: "B", regionText: "比", regionTitle: "bbb", regionHandler: function () {
                            alert("a");
                        },


                        title: "b2...",
                        value: "b2", text: "b2字段",
                        handler: function () {
                            alert("d");
                        }
                    },
                    foreign: {region: "C", value: "c1", text: "c1字段"}
                },
                {
                    primary: {region: "A", value: "a1", text: "a1字段"},
                    foreign: {region: "C", value: "c2", text: "c2字段"}
                },
                {
                    primary: {region: "C", value: "c3", text: "c3字段"},
                    foreign: {region: "D", value: "d1", text: "d1字段"}
                },
                {
                    primary: {region: "A", value: "a1", text: "a1字段"},
                    foreign: {region: "B", value: "b1", text: "b1字段"}
                },

                {
                    primary: {region: "X", value: "x1", text: "x1字段"},
                    foreign: {region: "Y", value: "y1", text: "y1字段"}
                },
                {
                    primary: {region: "X", value: "x2", text: "x2字段"},
                    foreign: {region: "Z", value: "z1", text: "z1字段"}
                },
                {
                    primary: {region: "X", value: "x2", text: "x2字段"},
                    foreign: {region: "B", value: "b1", text: "b1字段"}
                },
                {
                    primary: {region: "X33", value: "x233", text: "x233字段"}
                }
            ]
        });
        return {
            type: "bi.float_center_adapt",
            items: [{
                el: relationview
            }]
        };
    }
});
BI.shortcut("demo.relation_view", Demo.RelationView);