/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.MultiTreeSearchPane
 * @extends BI.Pane
 */

BI.MultiTreeSearchPane = BI.inherit(BI.Pane, {

    props: {
        baseCls: "bi-multi-tree-search-pane bi-card",
        itemsCreator: BI.emptyFn,
        keywordGetter: BI.emptyFn
    },

    render: function () {
        var self = this, opts = this.options;

        return BI.extend({
            type: "bi.part_tree",
            element: this,
            tipText: BI.i18nText("BI-No_Select"),
            itemsCreator: function (op, callback) {
                op.keyword = opts.keywordGetter();
                opts.itemsCreator(op, callback);
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
                    self.fireEvent(BI.MultiTreeSearchPane.EVENT_CHANGE);
                }
            }],
            ref: function (_ref) {
                self.partTree = _ref;
            }
        }, opts.el);
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

BI.MultiTreeSearchPane.EVENT_CHANGE = "EVENT_CHANGE";

BI.MultiTreeSearchPane.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.MultiTreeSearchPane.EVENT_CLICK_CLEAR = "EVENT_CLICK_CLEAR";

BI.shortcut("bi.multi_tree_search_pane", BI.MultiTreeSearchPane);