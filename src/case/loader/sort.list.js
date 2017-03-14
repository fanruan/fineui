/**
 * Created by GUY on 2016/4/29.
 *
 * @class BI.SortList
 * @extends BI.Widget
 */
BI.SortList = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SortList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-sort-list",

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

            //containment: this.element,
            //connectWith: ".bi-sort-list",
        })
    },

    _init: function () {
        BI.SortList.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.loader = BI.createWidget({
            type: "bi.list_loader",
            element: this.element,
            isDefaultInit: o.isDefaultInit,
            el: o.el,
            items: this._formatItems(o.items),
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (items) {
                    callback(self._formatItems(items));
                });
            },
            onLoaded: o.onLoaded,
            count: o.count,
            next: o.next,
            hasNext: o.hasNext
        });
        this.loader.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.SortList.EVENT_CHANGE, value, obj);
            }
        });

        this.loader.element.sortable({
            containment: o.containment || this.element,
            connectWith: o.connectWith || ".bi-sort-list",
            items: ".sort-item",
            cursor: "drag",
            tolerance: "intersect",
            placeholder: {
                element: function ($currentItem) {
                    var holder = BI.createWidget({
                        type: "bi.label",
                        cls: "bi-sortable-holder",
                        height: $currentItem.outerHeight()
                    });
                    holder.element.css({
                        "margin-left": $currentItem.css("margin-left"),
                        "margin-right": $currentItem.css("margin-right"),
                        "margin-top": $currentItem.css("margin-top"),
                        "margin-bottom": $currentItem.css("margin-bottom"),
                        "margin": $currentItem.css("margin")
                    });
                    return holder.element;
                },
                update: function () {

                }
            },
            start: function (event, ui) {

            },
            stop: function (event, ui) {
                self.fireEvent(BI.SortList.EVENT_CHANGE);
            },
            over: function (event, ui) {

            }
        });
    },

    _formatItems: function (items) {
        BI.each(items, function (i, item) {
            item = BI.stripEL(item);
            item.cls = item.cls ? item.cls + " sort-item" : "sort-item";
            item.attributes = {
                sorted: item.value
            };
        });
        return items;
    },

    hasNext: function () {
        return this.loader.hasNext();
    },

    addItems: function (items) {
        this.loader.addItems(items);
    },

    populate: function (items) {
        this.loader.populate.apply(this.loader, arguments);
    },

    empty: function () {
        this.loader.empty();
    },

    doBehavior: function () {
        this.loader.doBehavior.apply(this.loader, arguments);
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
        return this.loader.getValue();
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
    },

    getSortedValues: function () {
        return this.loader.element.sortable("toArray", {attribute: "sorted"});
    }
});
BI.SortList.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.sort_list", BI.SortList);