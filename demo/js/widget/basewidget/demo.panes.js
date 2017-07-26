/**
 * Created by Dailer on 2017/7/25.
 * copy from bi.mvc
 */

// need fix
Demo.Panes = BI.inherit(BI.Widget, {

    _createSearchPane: function () {
        var searcher = BI.createWidget({
            type: "bi.searcher_view",
            width: 200,
            height: 300,
            matcher: { //完全匹配的构造器
                type: "bi.button_group",
                behaviors: {
                    redmark: function () {
                        return true;
                    }
                },
                layouts: [{
                    type: "bi.vertical"
                }]
            },
            searcher: {
                type: "bi.button_group",
                behaviors: {
                    redmark: function () {
                        return true;
                    }
                },
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        });
        searcher.populate(BI.createItems(BI.first(Demo.CONSTANTS.ITEMS, 20), {
            type: "bi.multi_select_item",
            height: 25
        }), [{
            type: "bi.multi_select_item",
            height: 25,
            text: "这是一个完全匹配的项"
        }], "d");
        return searcher;
    },

    _createSearchTreePane: function () {
        var searcher = BI.createWidget({
            type: "bi.searcher_view",
            width: 200,
            height: 300,
            matcher: { //完全匹配的构造器
                type: "bi.button_group",
                behaviors: {
                    redmark: function () {
                        return true;
                    }
                },
                layouts: [{
                    type: "bi.vertical"
                }]
            },
            searcher: {
                type: "bi.custom_tree",
                el: {
                    type: "bi.button_tree",
                    behaviors: {
                        redmark: function () {
                            return true;
                        }
                    },
                    chooseType: 0,
                    layouts: [{
                        type: "bi.vertical",
                        lgap: 30
                    }]
                }
            }
        });
        searcher.populate(BI.deepClone(Demo.CONSTANTS.TREEITEMS), [{
            type: "bi.multi_select_item",
            height: 25,
            text: "这是一个完全匹配的项"
        }], "test");
        return searcher;
    },

    _createListPane: function () {
        var list = BI.createWidget({
            type: "bi.list_pane",
            cls: "mvc-border",
            width: 200,
            height: 100
        });
        list.populate([]);
        return list;
    },

    _createMultiSelectPane: function () {
        var list = BI.createWidget({
            type: "bi.select_list",
            cls: "mvc-border",
            logic: {
                dynamic: false
            },
            width: 200,
            height: 100,
            items: BI.createItems(BI.first(Demo.CONSTANTS.ITEMS, 1), {
                type: "bi.multi_select_item",
                height: 25
            }),
            el: {
                el: {
                    chooseType: BI.Selection.Multi
                }
            }
        });
        return list;
    },

    render: function () {
        // var wids = BI.Utils.getAllWidgetIDs();
        // var dids = BI.Utils.getAllTargetDimensionIDs(wids[0]);
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "bi.panel"
            }, {
                type: "bi.panel",
                title: "这是一个panel",
                titleButtons: [{
                    type: "bi.target_combo",
                    //need fix
                    //dId: true
                }],
                width: 300,
                height: 200,
                el: {
                    type: "bi.label",
                    text: "这是panel下的内容"
                }
            }, {
                type: "bi.label",
                height: 30,
                text: "这是一个list面板(Pane和buttonGroup的结合体)"
            }, this._createListPane(), {
                type: "bi.label",
                height: 30,
                text: "多选面板"
            }, this._createMultiSelectPane(), {
                type: "bi.label",
                height: 30,
                text: "带有确定取消按钮的下拉面板"
            }, {
                type: "bi.combo",
                width: 200,
                height: 30,
                el: {
                    type: "bi.button",
                    text: "点击下拉",
                    height: 30
                },
                popup: {
                    type: "bi.multi_popup_view",
                    el: {
                        type: "bi.button_group",
                        items: BI.createItems(BI.first(Demo.CONSTANTS.ITEMS, 20), {
                            type: "bi.multi_select_item"
                        }),
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    }
                }
            }, {
                type: "bi.label",
                height: 30,
                text: "popup弹出层带有确定取消关闭按钮"
            }, {
                type: "bi.combo",
                width: 200,
                height: 30,
                el: {
                    type: "bi.button",
                    text: "点击下拉",
                    height: 30
                },
                popup: {
                    type: "bi.popup_panel",
                    el: {
                        type: "bi.button_group",
                        items: BI.createItems(BI.first(Demo.CONSTANTS.ITEMS, 20), {
                            type: "bi.multi_select_item"
                        }),
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    },
                    buttons: ["取消", "确定"],
                    title: "弹出层面板"
                }
            }, {
                type: "bi.label",
                height: 30,
                text: "默认的搜索面板, 单选多选由searcher控制"
            }, this._createSearchPane(), {
                type: "bi.label",
                height: 30,
                text: "搜索的结果是一棵树"
            }, this._createSearchTreePane()],
            hgap: 50,
            vgap: 20
        }
    }
});
BI.shortcut("demo.panes", Demo.Panes);