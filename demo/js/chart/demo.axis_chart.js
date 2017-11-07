Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.tab",
            ref: function () {
                self.tab = this;
            },
            single: true,
            cardCreator: function (v) {
                return {
                    type: v
                }
            }
        };
    },

    mounted: function () {
        var self = this;
        var items = [[{
            "data": [
                {"x": "孙林", "y": 789},
                {"x": "金士鹏", "y": 156},
                {"x": "张珊", "y": 289},
                {"x": "孙阳", "y": 562},
                {"x": "袁成洁", "y": 546},
                {"x": "张颖", "y": 218},
                {"x": "王伟", "y": 541},
                {"x": "张武", "y": 219},
                {"x": "韩文", "y": 345}
            ],
            "name": "测试1",
            stack: 1
        }, {
            "data": [
                {"x": "孙林", "y": 789},
                {"x": "金士鹏", "y": 156},
                {"x": "张珊", "y": 289},
                {"x": "孙阳", "y": 562},
                {"x": "袁成洁", "y": 546},
                {"x": "张颖", "y": 218},
                {"x": "王伟", "y": 541},
                {"x": "张武", "y": 219},
                {"x": "韩文", "y": 345}
            ],
            "name": "测试2",
            stack: 1
        }]];
        var types = ["bi.axis_chart", "bi.line_chart", "bi.bar_chart"];
        var index = 0;
        this.tab.setSelect(types[index]);
        this.tab.populate(BI.deepClone(items));
        this.interval = setInterval(function () {
            index++;
            if (index >= types.length) {
                index = 0;
            }
            self.tab.setSelect(types[index]);
            self.tab.populate(BI.deepClone(items));
        }, 2000)
    },

    destroyed: function () {
        clearInterval(this.interval);
    }
});
BI.shortcut("demo.axis_chart", Demo.Func);
