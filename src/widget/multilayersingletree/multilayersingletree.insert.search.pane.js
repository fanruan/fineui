/**
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSingleTreeInsertSearchPane
 * @extends BI.Pane
 */

BI.MultiLayerSingleTreeInsertSearchPane = BI.inherit(BI.Widget, {

    props: function() {
        return {
            baseCls: "bi-multilayer-single-tree-popup",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            isDefaultInit: false,
            itemsCreator: BI.emptyFn,
            items: [],
            value: ""
        };
    },

    render: function() {
        var self = this, o = this.options;
        this.tree = BI.createWidget({
            type: "bi.multilayer_single_level_tree",
            isDefaultInit: o.isDefaultInit,
            items: o.items,
            itemsCreator: o.itemsCreator === BI.emptyFn ? BI.emptyFn : function (op, callback) {
                o.itemsCreator(op, function (res) {
                    callback(res);
                    self.setKeyword(o.keywordGetter());
                });
            },
            keywordGetter: o.keywordGetter,
            value: o.value,
            scrollable: null,
            listeners: [{
                eventName: BI.Controller.EVENT_CHANGE,
                action: function () {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                }
            }, {
                eventName: BI.MultiLayerSelectLevelTree.EVENT_CHANGE,
                action: function () {
                    self.fireEvent(BI.MultiLayerSingleTreeInsertSearchPane.EVENT_CHANGE);
                }
            }]
        });
        return {
            type: "bi.vertical",
            scrolly: false,
            scrollable: true,
            vgap: 5,
            items: [{
                type: "bi.text_button",
                invisible: true,
                text: BI.i18nText("BI-Basic_Click_To_Add_Text", ""),
                height: 24,
                cls: "bi-high-light",
                hgap: 5,
                ref: function (_ref) {
                    self.addNotMatchTip = _ref;
                },
                handler: function () {
                    self.fireEvent(BI.MultiLayerSingleTreeInsertSearchPane.EVENT_ADD_ITEM, o.keywordGetter());
                }
            }, this.tree]
        };
    },

    setKeyword: function (keyword) {
        var showTip = BI.isEmptyArray(this.tree.getAllLeaves());
        this.addNotMatchTip.setVisible(showTip);
        showTip && this.addNotMatchTip.setText(BI.i18nText("BI-Basic_Click_To_Add_Text", keyword));
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        this.tree.populate(items);
    }
});

BI.MultiLayerSingleTreeInsertSearchPane.EVENT_ADD_ITEM = "EVENT_ADD_ITEM";
BI.MultiLayerSingleTreeInsertSearchPane.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_single_tree_insert_search_pane", BI.MultiLayerSingleTreeInsertSearchPane);