/**
 * Created by roy on 15/9/8.
 * 处理popup中的item分组样式
 * 一个item分组中的成员大于一时，该分组设置为单选，并且默认状态第一个成员设置为已选择项
 */
BI.MultiLayerDownListPopup = BI.inherit(BI.Pane, {
    constants: {
        nextIcon: "pull-right-e-font",
        height: 25,
        iconHeight: 12,
        iconWidth: 12,
        hgap: 0,
        vgap: 0,
        border: 1
    },
    _defaultConfig: function () {
        var conf = BI.MultiLayerDownListPopup.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-down-list-popup",
            items: [],
            chooseType: BI.Selection.Multi
        });
    },
    _init: function () {
        BI.MultiLayerDownListPopup.superclass._init.apply(this, arguments);
        this.singleValues = [];
        this.childValueMap = {};
        this.fatherValueMap = {};
        this.items = [];
        var self = this, o = this.options, children = this._createPopupItems(o.items);
        this.popup = BI.createWidget({
            type: "bi.button_tree",
            items: BI.createItems(children,
                {}, {
                    adjustLength: -2
                }
            ),
            layouts: [{
                type: "bi.vertical",
                hgap: this.constants.hgap,
                vgap: this.constants.vgap
            }],
            value: this._digest(o.value),
            chooseType: o.chooseType
        });

        this.popup.on(BI.ButtonTree.EVENT_CHANGE, function (value, object) {
            var changedValue = value;
            if (BI.isNotNull(self.childValueMap[value])) {
                changedValue = self.childValueMap[value];
                var fatherValue = self.fatherValueMap[value];
                var fatherArrayValue = (fatherValue + "").split(BI.BlankSplitChar);
                self.fireEvent(BI.MultiLayerDownListPopup.EVENT_SON_VALUE_CHANGE, changedValue, fatherArrayValue.length > 1 ? fatherArrayValue : fatherValue);
            } else {
                self.fireEvent(BI.MultiLayerDownListPopup.EVENT_CHANGE, changedValue, object);
            }


            if (!BI.contains(self.singleValues, changedValue)) {
                var item = self.getValue();
                var result = [];
                BI.each(item, function (i, valueObject) {
                    if (valueObject.value != changedValue) {
                        result.push(valueObject);
                    }
                });
                self.setValue(result);
            }

        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.popup],
            vgap: 5
        });

    },
    _createPopupItems: function (items) {
        var self = this, result = [];
        BI.each(items, function (i, it) {
            var item_done = {
                type: "bi.down_list_group",
                items: []
            };
            var storeItem = [];

            BI.each(it, function (i, sourceItem) {
                var item = BI.extend({}, sourceItem);
                if (BI.isNotEmptyArray(sourceItem.children) && !BI.isEmpty(sourceItem.el)) {
                    item.type = "bi.combo_group";
                    item.cls = "down-list-group";
                    item.trigger = "hover";
                    item.isNeedAdjustWidth = false;
                    item.el = sourceItem.el;
                    item.el.title = sourceItem.el.title || sourceItem.el.text;
                    item.el.type = "bi.down_list_group_item";
                    item.el.logic = {
                        dynamic: true
                    };
                    item.el.height = sourceItem.el.height || self.constants.height;
                    item.el.iconCls2 = self.constants.nextIcon;
                    item.popup = {
                        lgap: 1,
                        el: {
                            type: "bi.button_tree",
                            chooseType: 0,
                            layouts: [{
                                type: "bi.vertical"
                            }]

                        },
                        innerVgap: 5,
                        maxHeight: 378,
                    };
                    self._createChildren(item, sourceItem);
                } else {
                    item.type = sourceItem.type || "bi.down_list_item";
                    item.title = sourceItem.title || sourceItem.text;
                    item.textRgap = 10;
                    item.isNeedAdjustWidth = false;
                    item.logic = {
                        dynamic: true
                    };
                }
                var el_done = {};
                el_done.el = item;
                item_done.items.push(el_done);
                storeItem.push(item);
            });
            if (self._isGroup(item_done.items)) {
                BI.each(item_done.items, function (i, item) {
                    self.singleValues.push(item.el.value);
                });
            }

            result.push(item_done);
            self.items.push(storeItem);
            if (self._needSpliter(i, items.length)) {
                var spliter_container = BI.createWidget({
                    type: "bi.vertical",
                    items: [{
                        el: {
                            type: "bi.layout",
                            cls: "bi-down-list-spliter bi-border-top cursor-pointer",
                            height: 0
                        }

                    }],
                    cls: "bi-down-list-spliter-container cursor-pointer",
                    vgap: 5,
                    lgap: 10
                });
                result.push(spliter_container);
            }
        });
        return result;
    },

    _createChildren: function (targetItem, sourceItem) {
        var self = this;
        this._formatEL(targetItem).el.childValues = [];
        targetItem.items = targetItem.children = [];
        BI.each(sourceItem.children, function (i, child) {
            var item = child.el ? BI.extend({}, child.el, {children: child.children}) : BI.extend({}, child);
            var fatherValue = BI.deepClone(self._formatEL(targetItem).el.value);
            var childValue = BI.deepClone(item.value);
            self.singleValues.push(item.value);
            item.type = item.type || "bi.down_list_item";
            item.extraCls = " child-down-list-item";
            item.title = item.title || item.text;
            item.textRgap = 10;
            item.isNeedAdjustWidth = false;
            item.logic = {
                dynamic: true
            };
            item.father = fatherValue;
            self.fatherValueMap[self._createChildValue(fatherValue, childValue)] = fatherValue;
            self.childValueMap[self._createChildValue(fatherValue, childValue)] = childValue;
            item.value = self._createChildValue(fatherValue, childValue);
            self._formatEL(targetItem).el.childValues.push(item.value);
            if (BI.isNotEmptyArray(child.children)) {
                item.type = "bi.down_list_group_item";
                item.iconCls2 = self.constants.nextIcon;
                item.height = child.height || self.constants.height;
                self._createChildren(item, child);
            }
            targetItem.items.push(item);
        });
    },

    _formatEL: function(obj) {
        if (obj && obj.el) {
            return obj;
        }

        return {
            el: obj
        };
    },

    _isGroup: function (i) {
        return i.length > 1;
    },

    _needSpliter: function (i, itemLength) {
        return i < itemLength - 1;
    },

    _createChildValue: function (fatherValue, childValue) {
        var fValue = fatherValue;
        if(BI.isArray(fatherValue)) {
            fValue = fatherValue.join(BI.BlankSplitChar);
        }
        return fValue + BI.BlankSplitChar + childValue;
    },

    _digest: function (valueItem) {
        var self = this;
        var valueArray = [];
        BI.each(valueItem, function (i, item) {
                var value;
                if (BI.isNotNull(item.childValue)) {
                    value = self._createChildValue(item.value, item.childValue);
                } else {
                    value = item.value;
                }
                valueArray.push(value);
            }
        );
        return valueArray;
    },

    _checkValues: function (values) {
        var self = this, o = this.options;
        var value = [];
        BI.each(this.items, function (idx, itemGroup) {
            BI.each(itemGroup, function (id, item) {
                if(BI.isNotNull(item.children)) {
                    var childValues = getChildrenValue(item);
                    var v = joinValue(childValues, values[idx]);
                    if(BI.isNotEmptyString(v)) {
                        value.push(v);
                    }
                }else{
                    if(item.value === values[idx][0]) {
                        value.push(values[idx][0]);
                    }
                }
            });
        });
        return value;

        function joinValue (sources, targets) {
            var value = "";
            BI.some(sources, function (idx, s) {
                return BI.some(targets, function (id, t) {
                    if(s === t) {
                        value = s;
                        return true;
                    }
                });
            });
            return value;
        }

        function getChildrenValue (item) {
            var children = [];
            if(BI.isNotNull(item.children)) {
                BI.each(item.children, function (idx, child) {
                    children = BI.concat(children, getChildrenValue(child));
                });
            } else {
                children.push(item.value);
            }
            return children;
        }
    },

    populate: function (items) {
        BI.MultiLayerDownListPopup.superclass.populate.apply(this, arguments);
        var self = this;
        self.childValueMap = {};
        self.fatherValueMap = {};
        self.singleValues = [];
        this.items = [];
        var children = self._createPopupItems(items);
        var popupItem = BI.createItems(children,
            {}, {
                adjustLength: -2
            }
        );
        self.popup.populate(popupItem);
    },

    setValue: function (valueItem) {
        this.popup.setValue(this._digest(valueItem));
    },

    _getValue: function () {
        var v = [];
        BI.each(this.popup.getAllButtons(), function (i, item) {
            i % 2 === 0 && v.push(item.getValue());
        });
        return v;
    },

    getValue: function () {
        var self = this, result = [];
        var values = this._checkValues(this._getValue());
        BI.each(values, function (i, value) {
            var valueItem = {};
            if (BI.isNotNull(self.childValueMap[value])) {
                var fartherValue = self.fatherValueMap[value];
                valueItem.childValue = self.childValueMap[value];
                var fatherArrayValue = (fartherValue + "").split(BI.BlankSplitChar);
                valueItem.value = fatherArrayValue.length > 1 ? fatherArrayValue : fartherValue;
            } else {
                valueItem.value = value;
            }
            result.push(valueItem);
        });
        return result;
    }


});

BI.MultiLayerDownListPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiLayerDownListPopup.EVENT_SON_VALUE_CHANGE = "EVENT_SON_VALUE_CHANGE";
BI.shortcut("bi.multi_layer_down_list_popup", BI.MultiLayerDownListPopup);
