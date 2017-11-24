/**
 * @Author: Young
 * @CreationDate 2017-11-06 10:32
 * @Description
 */
;(function () {
    var model = Fix.define({
        groups: [{
            id: "27a9c8bf159e99e",
            name: "功能数据",
            packages: [{
                id: "82a96a4b03ac17e6",
                name: "通信行业",
                type: 1,
                tables: [{
                    id: "品类",
                    name: "品类",
                    connName: "BIDemo",
                    fields: [{
                        id: "sd2ad2f343ca23",
                        name: "类别",
                        type: 32,
                        enable: true,
                        usable: true
                    }, {
                        id: "f34ds34aw2345w",
                        name: "描述",
                        type: 32,
                        enable: true,
                        usable: true
                    }]
                }]
            }]
        }, {
            id: "das2dw24214sa4",
            name: "样式数据",
            packages: [{
                id: "hi23i1o34a34we",
                name: "零售行业",
                type: 1,
                tables: [{
                    id: "销售记录",
                    name: "销售记录",
                    connName: "BIDemo",
                    fields: [{
                        id: "wr213d24t345",
                        name: "分类",
                        type: 16,
                        enable: true,
                        usable: true
                    }, {
                        id: "faw134r24al344",
                        name: "金额",
                        type: 32,
                        enable: true,
                        usable: true
                    }]
                }]
            }, {
                id: "fwr124f3453fa",
                name: "地产行业",
                tables: [{
                    id: "开发商名称",
                    name: "开发商名称",
                    connName: "BIDemo",
                    fields: [{
                        id: "sa13f345fg356",
                        name: "编号",
                        type: 32,
                        enable: true,
                        usable: true
                    }, {
                        id: "ad2r24tt232a22",
                        name: "名称",
                        type: 16,
                        enable: true,
                        usable: true
                    }]
                }, {
                    id: "楼盘",
                    name: "楼盘",
                    connName: "BIDemo",
                    fields: [{
                        id: "hfe3345fg356",
                        name: "编号",
                        type: 32,
                        enable: true,
                        usable: true
                    }, {
                        id: "kl224tt232a22",
                        name: "名称",
                        type: 16,
                        enable: true,
                        usable: true
                    }]
                }]
            }]
        }],
        fineIndexUpdate: {
            needUpdate: false,
            lastUpdate: 1509953199062
        }
    });

    Demo.FixScene = BI.inherit(BI.Widget, {
        constant: {
            TAB1: 1,
            TAB2: 2
        },

        _store: function () {
            return model;
        },

        watch: {
            "groups.*.name": function () {
                this.fineIndexTab.setText("FineIndex更新（******* 分组名变化 需要更新 *******）");
                this.model.fineIndexUpdate.needUpdate = true;
            },
            "groups.*.packages.*.name": function () {
                this.fineIndexTab.setText("FineIndex更新（******* 业务包名变化 需要更新 *******）");
                this.model.fineIndexUpdate.needUpdate = true;
            },
            "groups.*.packages.*.tables.*.name": function () {
                this.fineIndexTab.setText("FineIndex更新（******* 表名变化 需要更新 *******）");
                this.model.fineIndexUpdate.needUpdate = true;
            },
            "groups.*.packages.*.tables.*.fields.*.name": function () {
                this.fineIndexTab.setText("FineIndex更新（******* 字段名变化 需要更新 *******）");
                this.model.fineIndexUpdate.needUpdate = true;
            },
            "fineIndexUpdate.needUpdate": function (needUpdate) {
                !needUpdate && this.fineIndexTab.setText("FineIndex更新");
            }
        },

        render: function () {
            var self = this;
            return {
                type: "bi.tab",
                defaultShowIndex: this.constant.TAB1,
                single: true,
                tab: {
                    type: "bi.button_group",
                    items: BI.createItems([{
                        text: "业务包管理",
                        value: this.constant.TAB1
                    }, {
                        text: "FineIndex更新",
                        value: this.constant.TAB2,
                        ref: function (ref) {
                            self.fineIndexTab = ref;
                        }
                    }], {
                        type: "bi.text_button",
                        cls: "bi-list-item-active",
                        height: 50
                    }),
                    height: 50
                },
                cardCreator: BI.bind(this.cardCreator, this)
            }
        },

        cardCreator: function (v) {
            switch (v) {
                case this.constant.TAB1:
                    return {
                        type: "demo.fix_scene_data_manager",
                        data: this.model
                    };
                case this.constant.TAB2:
                    return {
                        type: "demo.fix_scene_fine_index_update"
                    }
            }
        }
    });
    BI.shortcut("demo.fix_scene", Demo.FixScene);

    Demo.FixSceneDataManager = BI.inherit(BI.Widget, {
        _store: function () {
            return this.options.data;
        },

        watch: {
            "*.name": function () {

            }
        },

        render: function () {
            var items = [];
            BI.each(this.model.groups, function (i, group) {
                items.push({
                    type: "demo.fix_scene_group",
                    group: group
                });
            });

            return {
                type: "bi.vertical",
                items: [{
                    type: "bi.left",
                    items: BI.createItems([{
                        text: "分组名"
                    }, {
                        text: "业务包名"
                    }, {
                        text: "表名"
                    }, {
                        text: "字段名"
                    }], {
                        type: "bi.label",
                        cls: "layout-bg1",
                        width: 150
                    })

                }, {
                    type: "bi.vertical",
                    items: items
                }],
                vgap: 20,
                hgap: 20
            }
        }

    });
    BI.shortcut("demo.fix_scene_data_manager", Demo.FixSceneDataManager);

    Demo.FixSceneGroup = BI.inherit(BI.Widget, {
        props: {
            group: {}
        },

        _store: function () {
            return this.options.group;
        },

        render: function () {
            var self = this;
            var items = [];
            BI.each(this.model.packages, function (i, child) {
                items.push({
                    type: "demo.fix_scene_package",
                    pack: child
                });
            });
            return {
                type: "bi.left",
                items: [{
                    type: "bi.sign_editor",
                    cls: "bi-border-bottom",
                    width: 100,
                    height: 30,
                    value: this.model.name,
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CHANGE,
                        action: function () {
                            self.model.name = this.getValue();
                        }
                    }]
                }, {
                    type: "bi.vertical",
                    items: items
                }],
                hgap: 20
            }
        }
    });
    BI.shortcut("demo.fix_scene_group", Demo.FixSceneGroup);


    Demo.FixScenePackage = BI.inherit(BI.Widget, {
        props: {
            pack: {}
        },

        _store: function () {
            return this.options.pack;
        },

        render: function () {
            var self = this;
            var items = [];
            BI.each(this.model.tables, function (i, child) {
                items.push({
                    type: "demo.fix_scene_table",
                    table: child
                })
            });
            return {
                type: "bi.left",
                items: [{
                    type: "bi.sign_editor",
                    cls: "bi-border-bottom",
                    width: 100,
                    height: 30,
                    value: this.model.name,
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CHANGE,
                        action: function () {
                            self.model.name = this.getValue();
                        }
                    }]
                }, {
                    type: "bi.vertical",
                    items: items
                }],
                hgap: 20
            }
        }
    });
    BI.shortcut("demo.fix_scene_package", Demo.FixScenePackage);

    Demo.FixSceneTable = BI.inherit(BI.Widget, {
        props: {
            table: {}
        },

        _store: function () {
            return this.options.table;
        },

        render: function () {
            var self = this;
            var items = [];
            BI.each(this.model.fields, function (i, child) {
                items.push({
                    type: "demo.fix_scene_field",
                    field: child
                });
            });
            return {
                type: "bi.left",
                items: [{
                    type: "bi.sign_editor",
                    cls: "bi-border-bottom",
                    width: 100,
                    height: 30,
                    value: this.model.name,
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CHANGE,
                        action: function () {
                            self.model.name = this.getValue();
                        }
                    }]
                }, {
                    type: "bi.vertical",
                    items: items
                }],
                hgap: 20
            }
        }
    });
    BI.shortcut("demo.fix_scene_table", Demo.FixSceneTable);

    Demo.FixSceneField = BI.inherit(BI.Widget, {
        props: {
            field: {}
        },

        _store: function () {
            return this.options.field;
        },

        render: function () {
            var self = this;
            return {
                type: "bi.center_adapt",
                items: [{
                    type: "bi.sign_editor",
                    cls: "bi-border-bottom",
                    width: 100,
                    height: 30,
                    value: this.model.name,
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CHANGE,
                        action: function () {
                            self.model.name = this.getValue();
                        }
                    }]
                }]
            }
        }
    });
    BI.shortcut("demo.fix_scene_field", Demo.FixSceneField);

    Demo.FixSceneFineIndexUpdateStore = BI.inherit(Fix.Model, {
        _init: function () {
            this.fineIndexUpdate = model.fineIndexUpdate;
        },
        computed: {
            text: function () {
                return "立即更新（上次更新时间：" + BI.date2Str(new Date(this.fineIndexUpdate.lastUpdate), "yyyy-MM-dd HH:mm:ss") + "）";
            },
            needUpdate: function () {
                return this.fineIndexUpdate.needUpdate;
            }
        },
        actions: {
            updateFineIndex: function () {
                this.fineIndexUpdate.needUpdate = false;
                this.fineIndexUpdate.lastUpdate = new Date().getTime();
            }
        }
    });

    Demo.FixSceneFineIndexUpdate = BI.inherit(BI.Widget, {
        _store: function () {
            return new Demo.FixSceneFineIndexUpdateStore();
        },

        watch: {
            "needUpdate": function () {
                this.button.setEnable(this.model.needUpdate)
            },
            "text": function () {
                this.button.setText(this.model.text);
            }
        },

        render: function () {
            var self = this;
            return {
                type: "bi.center_adapt",
                items: [{
                    type: "bi.button",
                    text: this.model.text,
                    disabled: !this.model.needUpdate,
                    height: 30,
                    width: 360,
                    handler: function () {
                        self.store.updateFineIndex();
                    },
                    ref: function (ref) {
                        self.button = ref;
                    }
                }]
            }
        }
    });
    BI.shortcut("demo.fix_scene_fine_index_update", Demo.FixSceneFineIndexUpdate);

})();