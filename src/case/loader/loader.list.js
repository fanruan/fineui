/**
 * 恶心的加载控件， 为解决排序问题引入的控件
 *
 * Created by GUY on 2015/11/12.
 * @class BI.ListLoader
 * @extends BI.Widget
 */
BI.ListLoader = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ListLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-list-loader",

            isDefaultInit: true,//是否默认初始化数据

            //下面是button_group的属性
            el: {
                type: "bi.button_group"
            },

            items: [],
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn,

            //下面是分页信息
            count: false,
            next: {},
            hasNext: BI.emptyFn
        })
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
        BI.ListLoader.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (o.itemsCreator === false) {
            o.next = false;
        }

        this.button_group = BI.createWidget(o.el, {
            type: "bi.button_group",
            element: this.element,
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
                self.fireEvent(BI.ListLoader.EVENT_CHANGE, obj);
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

        BI.createWidget({
            type: "bi.vertical",
            element: this.element,
            items: [this.next]
        });

        o.isDefaultInit && BI.isEmpty(o.items) && BI.nextTick(BI.bind(function () {
            this.populate();
        }, this));
        if (BI.isNotEmptyArray(o.items)) {
            this.populate(o.items);
        }
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
        this.next.element.appendTo(this.element);
    },

    populate: function (items) {
        var self = this, o = this.options;
        if (arguments.length === 0 && (BI.isFunction(o.itemsCreator))) {
            o.itemsCreator.apply(this, [{times: 1}, function () {
                if (arguments.length === 0) {
                    throw new Error("参数不能为空");
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
        BI.DOM.hang([this.next]);
        this.button_group.populate.apply(this.button_group, arguments);
        this.next.element.appendTo(this.element);
    },

    empty: function () {
        BI.DOM.hang([this.next]);
        this.button_group.empty();
        this.next.element.appendTo(this.element);
        BI.each([this.next], function (i, ob) {
            ob && ob.setVisible(false);
        });
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
    }
});
BI.ListLoader.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.list_loader", BI.ListLoader);