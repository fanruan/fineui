/**
 * Created by GUY on 2015/8/10.
 * @class BI.ButtonTree
 * @extends BI.ButtonGroup
 */

BI.ButtonTree = BI.inherit(BI.ButtonGroup, {
    _defaultConfig: function () {
        return BI.extend(BI.ButtonTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-button-tree"
        });
    },

    setNotSelectedValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (!BI.isFunction(item.setSelected)) {
                item.setNotSelectedValue(v);
                return;
            }
            if (BI.deepContains(v, item.getValue())) {
                item.setSelected(false);
            } else {
                item.setSelected(true);
            }
        });
    },

    setEnabledValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (BI.isFunction(item.setEnabledValue)) {
                item.setEnabledValue(v);
                return;
            }
            if (BI.deepContains(v, item.getValue())) {
                item.setEnable(true);
            } else {
                item.setEnable(false);
            }
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (!BI.isFunction(item.setSelected)) {
                item.setValue(v);
                return;
            }
            if (BI.deepContains(v, item.getValue())) {
                item.setSelected(true);
            } else {
                item.setSelected(false);
            }
        });
    },

    getNotSelectedValue: function () {
        var v = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !BI.isFunction(item.setSelected)) {
                v = BI.concat(v, item.getNotSelectedValue());
                return;
            }
            if (item.isEnabled() && item.isSelected && !item.isSelected()) {
                v.push(item.getValue());
            }
        });
        return v;
    },

    getValue: function () {
        var v = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !BI.isFunction(item.setSelected)) {
                v = BI.concat(v, item.getValue());
                return;
            }
            if (item.isEnabled() && item.isSelected && item.isSelected()) {
                v.push(item.getValue());
            }
        });
        return v;
    },

    getSelectedButtons: function () {
        var btns = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !BI.isFunction(item.setSelected)) {
                btns = btns.concat(item.getSelectedButtons());
                return;
            }
            if (item.isSelected && item.isSelected()) {
                btns.push(item);
            }
        });
        return btns;
    },

    getNotSelectedButtons: function () {
        var btns = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !BI.isFunction(item.setSelected)) {
                btns = btns.concat(item.getNotSelectedButtons());
                return;
            }
            if (item.isSelected && !item.isSelected()) {
                btns.push(item);
            }
        });
        return btns;
    },

    // 获取所有的叶子节点
    getAllLeaves: function () {
        var leaves = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !BI.isFunction(item.setSelected)) {
                leaves = leaves.concat(item.getAllLeaves());
                return;
            }
            if (item.isEnabled()) {
                leaves.push(item);
            }
        });
        return leaves;
    },

    getIndexByValue: function (value) {
        var index = -1;
        BI.any(this.buttons, function (i, item) {
            var vs = item.getValue();
            if (item.isEnabled() && (vs === value || BI.contains(vs, value))) {
                index = i;
                return true;
            }
        });
        return index;
    },

    getNodeById: function (id) {
        var node;
        BI.any(this.buttons, function (i, item) {
            if (item.isEnabled()) {
                if (item.attr("id") === id) {
                    node = item;
                    return true;
                } else if (BI.isFunction(item.getNodeById)) {
                    if (node = item.getNodeById(id)) {
                        return true;
                    }
                }
            }
        });
        return node;
    },

    getNodeByValue: function (value) {
        var node;
        BI.any(this.buttons, function (i, item) {
            if (item.isEnabled()) {
                if (BI.isFunction(item.getNodeByValue)) {
                    if (node = item.getNodeByValue(value)) {
                        return true;
                    }
                } else if (item.attr("value") === value) {
                    node = item;
                    return true;
                }
            }
        });
        return node;
    }
});
BI.ButtonTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.button_tree", BI.ButtonTree);
