/**
 * 字段列表
 *
 * Created by GUY on 2015/9/14.
 * @class BI.SelectDataLoader
 * @extends BI.Widget
 */
BI.SelectDataLoader = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-loader",
            items: [],
            el: {},
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.SelectDataLoader.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.loader = BI.createWidget({
            type: "bi.loader",
            isDefaultInit: false,
            element: this,
            items: o.items,
            itemsCreator: o.itemsCreator,
            el: BI.extend({
                type: "bi.button_tree",
                behaviors: {
                    redmark: function () {
                        return true;
                    }
                },
                chooseType: BI.Selection.Multi,
                layouts: [{
                    type: "bi.vertical",
                    hgap: 0,
                    vgap: 0
                }]
            }, o.el)
        });
        this.loader.on(BI.Controller.EVENT_CHANGE, function (type, val, ob) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                if (ob.isSelected()) {
                    var index = this.getIndexByValue(val);
                    if (index > -1) {
                        var alls = this.getAllButtons();
                        if (index - 1 >= 0) {
                            if (BI.isNotNull(alls[index - 1]) && BI.isFunction(alls[index - 1].isSelected)
                                && alls[index - 1].isSelected()) {
                                alls[index - 1].setBottomLineVisible();
                                ob.setTopLineVisible();
                            }
                        }
                        if (index + 1 <= alls.length - 1) {
                            if (BI.isNotNull(alls[index + 1]) && BI.isFunction(alls[index + 1].isSelected)
                                && alls[index + 1].isSelected()) {
                                alls[index + 1].setTopLineVisible();
                                ob.setBottomLineVisible();
                            }
                        }
                    }
                } else {
                    var index = this.getIndexByValue(val);
                    if (index > -1) {
                        var alls = this.getAllButtons();
                        if (index - 1 >= 0) {
                            if (BI.isNotNull(alls[index - 1]) && BI.isFunction(alls[index - 1].isSelected)
                                && alls[index - 1].isSelected()) {
                                alls[index - 1].setBottomLineInVisible();
                            }
                        }
                        if (index + 1 <= alls.length - 1) {
                            if (BI.isNotNull(alls[index + 1]) && BI.isFunction(alls[index + 1].isSelected)
                                && alls[index + 1].isSelected()) {
                                alls[index + 1].setTopLineInVisible();
                            }
                        }
                    }
                }
                self.fireEvent(BI.SelectDataLoader.EVENT_CHANGE);
            }
        })
    },

    setEnable: function (v) {
        BI.SelectDataLoader.superclass.setEnable.apply(this, arguments);
        this.loader.setEnable(v)
    },

    doBehavior: function () {
        this.loader.doBehavior.apply(this.loader, arguments);
    },

    populate: function () {
        this.loader.populate.apply(this.loader, arguments);
    },

    getAllButtons: function(){
        return this.loader.getAllButtons();
    },

    showView: function(b){
        BI.each(this.loader.getAllButtons(),function(i, button){
            button.showView && button.showView(b);
        })
    },

    hideView: function(b){
        BI.each(this.loader.getAllButtons(),function(i, button){
            button.hideView && button.hideView(b);
        })
    },

    setValue: function (v) {
        this.loader.setValue(v);
    },

    getValue: function () {
        return this.loader.getValue();
    },

    empty: function () {
        this.loader.empty();
    }
});
BI.SelectDataLoader.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.select_data_loader", BI.SelectDataLoader);