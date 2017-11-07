Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createDefaultTree: function(){
        var tree = BI.createWidget({
            type: "bi.tree_view"
        });
        tree.initTree([
            {"id":1, "pId":0, "text":"test1", open:true},
            {"id":11, "pId":1, "text":"test11"},
            {"id":12, "pId":1, "text":"test12"},
            {"id":111, "pId":11, "text":"test111"},
            {"id":2, "pId":0, "text":"test2", open:true},
            {"id":21, "pId":2, "text":"test21"},
            {"id":22, "pId":2, "text":"test22"}
        ])
        return tree;
    },

    render: function () {
        var self = this;
        BI.createWidget({
            type: "bi.grid",
            columns: 1,
            rows: 1,
            element: this,
            items: [{
                column: 0,
                row: 0,
                el: {
                    type: "bi.vtape",
                    items: [
                        {
                            el: this._createDefaultTree()
                        },
                        {
                            el: {
                                type: "bi.label",
                                text: 'tree.initTree([{"id":1, "pId":0, "text":"test1", open:true},{"id":11, "pId":1, "text":"test11"},{"id":12, "pId":1, "text":"test12"},{"id":111, "pId":11, "text":"test111"}])',
                                whiteSpace: "normal"
                            },
                            height: 50
                        }
                    ]
                }
            }]
        })
    }
});
BI.shortcut("demo.tree_view", Demo.Func);