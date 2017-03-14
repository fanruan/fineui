/**
 * 选择列表
 *
 * Created by GUY on 2015/11/1.
 * @class BI.SelectList
 * @extends BI.Widget
 */
BI.SelectList = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-list",
            direction: BI.Direction.Top,//toolbar的位置
            logic: {
                dynamic: true
            },
            items: [],
            itemsCreator: BI.emptyFn,
            hasNext: BI.emptyFn,
            onLoaded: BI.emptyFn,
            toolbar: {
                type: "bi.multi_select_bar"
            },
            el: {
                type: "bi.list_pane"
            }
        })
    },
    _init: function () {
        BI.SelectList.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        //全选
        this.toolbar = BI.createWidget(o.toolbar);
        this.toolbar.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            var isAllSelected = this.isSelected();
            if (type === BI.Events.CLICK) {
                self.setAllSelected(isAllSelected);
                self.fireEvent(BI.SelectList.EVENT_CHANGE, value, obj);
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.list = BI.createWidget(o.el, {
            type: "bi.list_pane",
            items: o.items,
            itemsCreator: function (op, callback) {
                op.times === 1 && self.toolbar.setVisible(false);
                o.itemsCreator(op, function (items) {
                    callback.apply(self, arguments);
                    if (op.times === 1) {
                        self.toolbar.setVisible(items && items.length > 0);
                        self.toolbar.setEnable(items && items.length > 0);
                    }
                    self._checkAllSelected();
                });
            },
            onLoaded: o.onLoaded,
            hasNext: o.hasNext
        });

        this.list.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (type === BI.Events.CLICK) {
                self._checkAllSelected();
                self.fireEvent(BI.SelectList.EVENT_CHANGE, value, obj);
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({
            scrolly: true
        }, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.toolbar, this.list)
        }))));

        if (o.items.length <= 0) {
            this.toolbar.setVisible(false);
            this.toolbar.setEnable(false);
        }
    },

    _checkAllSelected: function () {
        var selectLength = this.list.getValue().length;
        var notSelectLength = this.getAllLeaves().length - selectLength;
        var hasNext = this.list.hasNext();
        var isAlreadyAllSelected = this.toolbar.isSelected();
        var isHalf = selectLength > 0 && (notSelectLength > 0 || (!isAlreadyAllSelected && hasNext));
        isHalf = isHalf || (notSelectLength > 0 && hasNext && isAlreadyAllSelected);
        this.toolbar.setHalfSelected(isHalf);
        !isHalf && this.toolbar.setSelected(selectLength > 0 && notSelectLength <= 0 && (!hasNext || isAlreadyAllSelected));
    },

    setAllSelected: function (v) {
        BI.each(this.getAllButtons(), function (i, btn) {
            (btn.setSelected || btn.setAllSelected).apply(btn, [v]);
        });
        this.toolbar.setSelected(v);
        this.toolbar.setHalfSelected(false);
    },

    setToolBarVisible: function (b) {
        this.toolbar.setVisible(b);
    },

    isAllSelected: function () {
        return this.toolbar.isSelected();
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

    setValue: function (data) {
        var selectAll = data.type === BI.ButtonGroup.CHOOSE_TYPE_ALL;
        this.setAllSelected(selectAll);
        this.list[selectAll ? "setNotSelectedValue" : "setValue"](data.value);
        this._checkAllSelected();
    },

    getValue: function () {
        if (this.isAllSelected() === false) {
            return {
                type: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                value: this.list.getValue(),
                assist: this.list.getNotSelectedValue()
            };
        } else {
            return {
                type: BI.ButtonGroup.CHOOSE_TYPE_ALL,
                value: this.list.getNotSelectedValue(),
                assist: this.list.getValue()
            };
        }
    },

    empty: function () {
        this.list.empty();
    },

    populate: function (items) {
        this.toolbar.setVisible(!BI.isEmptyArray(items));
        this.toolbar.setEnable(!BI.isEmptyArray(items));
        this.list.populate.apply(this.list, arguments);
        this._checkAllSelected();
    },

    resetHeight: function (h) {
        var toolHeight = ( this.toolbar.element.outerHeight() || 25) * ( this.toolbar.isVisible() ? 1 : 0);
        this.list.resetHeight ? this.list.resetHeight(h - toolHeight) :
            this.list.element.css({"max-height": h - toolHeight + "px"})
    },

    doBehavior: function () {
        this.list.doBehavior.apply(this.list, arguments);
    },

    setNotSelectedValue: function () {
        this.list.setNotSelectedValue.apply(this.list, arguments);
        this._checkAllSelected();
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
BI.SelectList.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.select_list", BI.SelectList);