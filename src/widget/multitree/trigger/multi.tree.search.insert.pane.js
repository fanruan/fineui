/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.MultiTreeSearchInsertPane
 * @extends BI.Pane
 */

BI.MultiTreeSearchInsertPane = BI.inherit(BI.Widget, {

    constants: {
        height: 24,
    },

    props: {
        baseCls: "bi-multi-tree-search-insert-pane bi-card",
        itemsCreator: BI.emptyFn,
        keywordGetter: BI.emptyFn
    },

    render: function () {
        var self = this, opts = this.options;

        return {
            type: "bi.vertical",
            items: [{
                type: "bi.text_button",
                invisible: true,
                ref: function (_ref) {
                    self.addTip = _ref;
                },
                text: BI.i18nText("BI-Basic_Click_To_Add_Text", ""),
                height: this.constants.height,
                cls: "bi-high-light",
                hgap: 5,
                handler: function () {
                    self.fireEvent(BI.MultiTreeSearchInsertPane.EVENT_ADD_ITEM, opts.keywordGetter());
                }
            }, {
                type: "bi.part_tree",
                tipText: BI.i18nText("BI-No_Select"),
                itemsCreator: function (op, callback) {
                    op.keyword = opts.keywordGetter();
                    opts.itemsCreator(op, function (res) {
                        callback(res);
                        self.setKeyword(opts.keywordGetter(), res.items);
                    });
                },
                ref: function (_ref) {
                    self.partTree = _ref;
                },
                value: opts.value,
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    }
                }, {
                    eventName: BI.TreeView.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.MultiTreeSearchInsertPane.EVENT_CHANGE);
                    }
                }]
            }]
        };
    },

    setKeyword: function (keyword, nodes) {
        var isAddTipVisible = BI.isEmptyArray(nodes);
        this.addTip.setVisible(isAddTipVisible);
        this.partTree.setVisible(!isAddTipVisible);
        isAddTipVisible && this.addTip.setText(BI.i18nText("BI-Basic_Click_To_Add_Text", keyword));
    },

    hasChecked: function () {
        return this.partTree.hasChecked();
    },

    setValue: function (v) {
        this.setSelectedValue(v.value);
    },

    setSelectedValue: function (v) {
        v || (v = {});
        this.partTree.setSelectedValue(v);
    },

    getValue: function () {
        return this.partTree.getValue();
    },

    empty: function () {
        this.partTree.empty();
    },

    populate: function (op) {
        this.partTree.stroke.apply(this.partTree, arguments);
    }
});

BI.MultiTreeSearchInsertPane.EVENT_CHANGE = "EVENT_CHANGE";

BI.MultiTreeSearchInsertPane.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.MultiTreeSearchInsertPane.EVENT_CLICK_CLEAR = "EVENT_CLICK_CLEAR";
BI.MultiTreeSearchInsertPane.EVENT_ADD_ITEM = "EVENT_ADD_ITEM";

BI.shortcut("bi.multi_tree_search_insert_pane", BI.MultiTreeSearchInsertPane);