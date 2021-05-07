/**
 * 选择列表
 *
 * Created by GUY on 2015/11/1.
 * @class BI.SingleSelectList
 * @extends BI.Widget
 */
BI.SingleSelectList = BI.inherit(BI.Widget, {

    _constants: {
        itemHeight: 24
    },

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-list",
            direction: BI.Direction.Top, // toolbar的位置
            logic: {
                dynamic: true
            },
            items: [],
            itemsCreator: BI.emptyFn,
            hasNext: BI.emptyFn,
            onLoaded: BI.emptyFn,
            el: {
                type: "bi.list_pane"
            },
            allowNoSelect: false
        });
    },
    _init: function () {
        BI.SingleSelectList.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.list = BI.createWidget(o.el, {
            type: "bi.list_pane",
            items: o.items,
            itemsCreator: function (op, callback) {
                op.times === 1 && self.toolbar && self.toolbar.setVisible(false);
                o.itemsCreator(op, function (items) {
                    callback.apply(self, arguments);
                    if (op.times === 1) {
                        self.toolbar && self.toolbar.setVisible(items && items.length > 0);
                        self.toolbar && self.toolbar.setEnable(items && items.length > 0);
                    }
                });
            },
            onLoaded: o.onLoaded,
            hasNext: o.hasNext,
            value: o.value
        });

        this.list.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.SingleSelectList.EVENT_CHANGE, value, obj);
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({
            scrolly: true
        }, o.logic, {
            items: o.allowNoSelect ? BI.LogicFactory.createLogicItemsByDirection(o.direction, {
                type: "bi.single_select_item",
                cls: "bi-list-item-active",
                height: this._constants.itemHeight,
                forceNotSelected: true,
                text: BI.i18nText("BI-Basic_No_Select"),
                ref: function (_ref) {
                    self.toolbar = _ref;
                },
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function (type) {
                        if (type === BI.Events.CLICK) {
                            self.list.setValue();
                            self.fireEvent(BI.SingleSelectList.EVENT_CHANGE);
                        }
                        self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    }
                }]
            }, this.list) : BI.LogicFactory.createLogicItemsByDirection(o.direction, this.list)
        }))));

    },

    hasPrev: function () {
        return this.list.hasPrev();
    },

    hasNext: function () {
        return this.list.hasNext();
    },

    prependItems: function (items) {
        this.list.prependItems.apply(this.list, arguments);
    },

    addItems: function (items) {
        this.list.addItems.apply(this.list, arguments);
    },

    setValue: function (v) {
        this.list.setValue([v]);
    },

    getValue: function () {
        return this.list.getValue()[0];
    },

    empty: function () {
        this.list.empty();
    },

    populate: function (items) {
        this.list.populate.apply(this.list, arguments);
    },

    resetHeight: function (h) {
        this.list.resetHeight ? this.list.resetHeight(h) :
            this.list.element.css({"max-height": (h - (this.options.allowNoSelect ? this._constants.itemHeight : 0)) / BI.pixRatio + BI.pixUnit});
    },

    setNotSelectedValue: function () {
        this.list.setNotSelectedValue.apply(this.list, arguments);
    },

    getNotSelectedValue: function () {
        return this.list.getNotSelectedValue();
    },

    getAllButtons: function () {
        return this.list.getAllButtons();
    },

    getAllLeaves: function () {
        return this.list.getAllLeaves();
    },

    getSelectedButtons: function () {
        return this.list.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.list.getNotSelectedButtons();
    },

    getIndexByValue: function (value) {
        return this.list.getIndexByValue(value);
    },

    getNodeById: function (id) {
        return this.list.getNodeById(id);
    },

    getNodeByValue: function (value) {
        return this.list.getNodeByValue(value);
    }
});
BI.SingleSelectList.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_select_list", BI.SingleSelectList);
