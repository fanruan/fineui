Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var ref;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.custom_tree",
                ref: function (_ref) {
                    ref = _ref;
                },
                el: {
                    type: "bi.button_tree",
                    chooseType: 0,
                    layouts: [{
                        type: "bi.vertical"
                    }],
                    behaviors: {
                        redmark: function () {
                            return true;
                        }
                    },
                }
            }, {
                type: "bi.button",
                text: "populate",
                handler: function () {
                    ref.populate([
                        {
                            "type": "bi.multilayer_icon_tree_leaf_item",
                            "id": 0,
                            "pId": 100,
                            "text": "归一化1",
                            "title": "归一化1",
                            "value": {
                                "modelType": 100,
                                "modelName": "归一化1"
                            },
                            "isParent": false,
                            "layer": 1
                        },
                        {
                            "type": "bi.multilayer_icon_tree_leaf_item",
                            "id": 1,
                            "pId": 100,
                            "text": "标准化1",
                            "title": "标准化1",
                            "value": {
                                "modelType": 100,
                                "modelName": "标准化1"
                            },
                            "isParent": false,
                            "layer": 1
                        },
                        {
                            "type": "bi.multilayer_icon_tree_leaf_item",
                            "id": 2,
                            "pId": 103,
                            "text": "主成分1",
                            "title": "主成分1",
                            "value": {
                                "modelType": 103,
                                "modelName": "主成分1"
                            },
                            "isParent": false,
                            "layer": 1
                        },
                        {
                            "type": "bi.multilayer_icon_tree_leaf_item",
                            "id": 3,
                            "pId": 102,
                            "text": "特征工程1",
                            "title": "特征工程1",
                            "value": {
                                "modelType": 102,
                                "modelName": "特征工程1"
                            },
                            "isParent": false,
                            "layer": 1
                        }
                    ], "t");
                }
            }]

        };
    }
});
BI.shortcut("demo.button_group", Demo.Func);