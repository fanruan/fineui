Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    mounted: function () {
        this.pager.populate();
    },

    render: function () {
        var self = this;
        BI.createWidget({
            type: "bi.vertical",
            hgap: 200,
            vgap: 50,
            element: this,
            items: [{
                type: "bi.direction_pager",
                ref: function (_ref) {
                    self.pager = _ref;
                },
                horizontal: {
                    pages: false, // 总页数
                    curr: 1, // 初始化当前页， pages为数字时可用

                    hasPrev: function (v) {
                        return v > 1;
                    },
                    hasNext: function () {
                        return true;
                    },
                    firstPage: 1
                },
                vertical: {
                    pages: false, // 总页数
                    curr: 1, // 初始化当前页， pages为数字时可用

                    hasPrev: function (v) {
                        return v > 1;
                    },
                    hasNext: function () {
                        return true;
                    },
                    firstPage: 1
                }
            }]
        });
    }
});
BI.shortcut("demo.direction_pager", Demo.Func);