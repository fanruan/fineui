/**
 * 加载控件
 *
 * Created by GUY on 2015/8/31.
 * @class BI.Loader
 * @extends BI.Widget
 */
BI.Loader = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Loader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-loader",

            direction: "top",
            isDefaultInit: true,//是否默认初始化数据
            logic: {
                dynamic: true,
                scrolly: true
            },

            //下面是button_group的属性
            el: {
                type: "bi.button_group"
            },

            items: [],
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn,

            //下面是分页信息
            count: false,
            prev: false,
            next: {},
            hasPrev: BI.emptyFn,
            hasNext: BI.emptyFn
        })
    },

    _prevLoad: function () {
        var self = this, o = this.options;
        this.prev.setLoading();
        o.itemsCreator.apply(this, [{times: --this.times}, function () {
            self.prev.setLoaded();
            self.prependItems.apply(self, arguments);
        }]);
    },

    _nextLoad: function () {
        var self = this, o = this.options;
        this.next.setLoading();
        o.itemsCreator.apply(this, [{times: ++this.times}, function () {
            self.next.setLoaded();
            self.addItems.apply(self, arguments);
        }]);
    },

    _init: function () {
        BI.Loader.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (o.itemsCreator === false) {
            o.prev = false;
            o.next = false;
        }
        if (o.prev !== false) {
            this.prev = BI.createWidget(BI.extend({
                type: "bi.loading_bar"
            }, o.prev));
            this.prev.on(BI.Controller.EVENT_CHANGE, function (type) {
                if (type === BI.Events.CLICK) {
                    self._prevLoad();
                }
            });
        }

        this.button_group = BI.createWidget(o.el, {
            type: "bi.button_group",
            chooseType: 0,
            items: o.items,
            behaviors: {},
            layouts: [{
                type: "bi.vertical"
            }]
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.Loader.EVENT_CHANGE, obj);
            }
        });

        if (o.next !== false) {
            this.next = BI.createWidget(BI.extend({
                type: "bi.loading_bar"
            }, o.next));
            this.next.on(BI.Controller.EVENT_CHANGE, function (type) {
                if (type === BI.Events.CLICK) {
                    self._nextLoad();
                }
            })
        }

        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({
            scrolly: true
        }, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.prev, this.button_group, this.next)
        }))));

        o.isDefaultInit && BI.isEmpty(o.items) && BI.nextTick(BI.bind(function () {
            o.isDefaultInit && BI.isEmpty(o.items) && this.populate();
        }, this));
        if (BI.isNotEmptyArray(o.items)) {
            this.populate(o.items);
        }
    },

    hasPrev: function () {
        var o = this.options;
        if (BI.isNumber(o.count)) {
            return this.count < o.count;
        }
        return !!o.hasPrev.apply(this, [{
            times: this.times,
            count: this.count
        }])
    },

    hasNext: function () {
        var o = this.options;
        if (BI.isNumber(o.count)) {
            return this.count < o.count;
        }
        return !!o.hasNext.apply(this, [{
            times: this.times,
            count: this.count
        }])
    },

    prependItems: function (items) {
        this.count += items.length;
        if (this.next !== false) {
            if (this.hasPrev()) {
                this.options.items = this.options.items.concat(items);
                this.prev.setLoaded();
            } else {
                this.prev.setEnd();
            }
        }
        this.button_group.prependItems.apply(this.button_group, arguments);
    },

    addItems: function (items) {
        this.count += items.length;
        if (BI.isObject(this.next)) {
            if (this.hasNext()) {
                this.options.items = this.options.items.concat(items);
                this.next.setLoaded();
            } else {
                this.next.setEnd();
            }
        }
        this.button_group.addItems.apply(this.button_group, arguments);
    },

    populate: function (items) {
        var self = this, o = this.options;
        if (arguments.length === 0 && (BI.isFunction(o.itemsCreator))) {
            o.itemsCreator.apply(this, [{times: 1}, function () {
                if (arguments.length === 0) {
                    throw new Error("arguments can not be null!!!");
                }
                self.populate.apply(self, arguments);
                o.onLoaded();
            }]);
            return;
        }
        this.options.items = items;
        this.times = 1;
        this.count = 0;
        this.count += items.length;
        if (BI.isObject(this.next)) {
            if (this.hasNext()) {
                this.next.setLoaded();
            } else {
                this.next.invisible();
            }
        }
        if (BI.isObject(this.prev)) {
            if (this.hasPrev()) {
                this.prev.setLoaded();
            } else {
                this.prev.invisible();
            }
        }
        this.button_group.populate.apply(this.button_group, arguments);
    },

    setEnable: function (v) {
        this.button_group.setEnable(v);
    },

    doBehavior: function () {
        this.button_group.doBehavior.apply(this.button_group, arguments);
    },

    setNotSelectedValue: function () {
        this.button_group.setNotSelectedValue.apply(this.button_group, arguments);
    },

    getNotSelectedValue: function () {
        return this.button_group.getNotSelectedValue();
    },

    setValue: function () {
        this.button_group.setValue.apply(this.button_group, arguments);
    },

    getValue: function () {
        return this.button_group.getValue.apply(this.button_group, arguments);
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    getAllLeaves: function () {
        return this.button_group.getAllLeaves();
    },

    getSelectedButtons: function () {
        return this.button_group.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.button_group.getNotSelectedButtons();
    },

    getIndexByValue: function (value) {
        return this.button_group.getIndexByValue(value);
    },

    getNodeById: function (id) {
        return this.button_group.getNodeById(id);
    },

    getNodeByValue: function (value) {
        return this.button_group.getNodeByValue(value);
    },

    empty: function () {
        this.button_group.empty();
        BI.each([this.prev, this.next], function (i, ob) {
            ob && ob.setVisible(false);
        });
    },

    destroy: function () {
        BI.Loader.superclass.destroy.apply(this, arguments);
    }
});
BI.Loader.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.loader", BI.Loader);