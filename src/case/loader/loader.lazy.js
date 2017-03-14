/**
 * Created by roy on 15/11/6.
 */
BI.LazyLoader = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LazyLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-lazy-loader",
            el: {}
        })
    },

    _init: function () {
        var self = this, o = this.options;
        BI.LazyLoader.superclass._init.apply(this, arguments);
        var all = o.items.length;
        this.loader = BI.createWidget({
            type: "bi.loader",
            element: this.element,
            //下面是button_group的属性
            el: o.el,

            itemsCreator: function (options, populate) {
                populate(self._getNextItems(options));
            },
            hasNext: function (option) {
                return option.count < all;
            }
        });

        this.loader.on(BI.Loader.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.LazyLoader.EVENT_CHANGE, obj)
        })
    },
    _getNextItems: function (options) {
        var self = this, o = this.options;
        var lastNum = o.items.length - BICst.PAGE_COUNT * (options.times - 1);
        var lastItems = BI.last(o.items, lastNum);
        var nextItems = BI.first(lastItems, BICst.PAGE_COUNT);
        return nextItems;
    },

    populate: function (items) {
        this.loader.populate(items);
    },

    addItems: function (items) {
        this.loader.addItems(items);
    },

    empty: function () {
        this.loader.empty();
    },

    doBehavior: function () {
        this.loader.doBehavior();
    },

    setNotSelectedValue: function () {
        this.loader.setNotSelectedValue.apply(this.loader, arguments);
    },

    getNotSelectedValue: function () {
        return this.loader.getNotSelectedValue();
    },

    setValue: function () {
        this.loader.setValue.apply(this.loader, arguments);
    },

    getValue: function () {
        return this.loader.getValue.apply(this.loader, arguments);
    },

    getAllButtons: function () {
        return this.loader.getAllButtons();
    },

    getAllLeaves: function () {
        return this.loader.getAllLeaves();
    },

    getSelectedButtons: function () {
        return this.loader.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.loader.getNotSelectedButtons();
    },

    getIndexByValue: function (value) {
        return this.loader.getIndexByValue(value);
    },

    getNodeById: function (id) {
        return this.loader.getNodeById(id);
    },

    getNodeByValue: function (value) {
        return this.loader.getNodeByValue(value);
    }
});
BI.LazyLoader.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.lazy_loader", BI.LazyLoader);