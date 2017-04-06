/**
 * Created by User on 2017/3/22.
 */
Demo.LeftRightVerticalAdaptLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-left-right-vertical-adapt"
    },
    render: function () {
        return {
            type: "bi.left_right_vertical_adapt",
            lhgap: 10,
            rhgap: 30,
            items: {
                left: [{
                    type: "bi.label",
                    text: "左边的垂直居中",
                    cls: "layout-bg1",
                    width: 100,
                    height: 30
                }, {
                    type: "bi.label",
                    text: "左边的垂直居中",
                    cls: "layout-bg2",
                    width: 100,
                    height: 30
                }],
                right: [{
                    type: "bi.label",
                    text: "右边的垂直居中",
                    cls: "layout-bg1",
                    width: 100,
                    height: 30
                }, {
                    type: "bi.label",
                    text: "右边的垂直居中",
                    cls: "layout-bg2",
                    width: 100,
                    height: 30
                }]
            }
        }
    }
});
BI.shortcut("demo.left_right_vertical_adapt", Demo.LeftRightVerticalAdaptLayout);