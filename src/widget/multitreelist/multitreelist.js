/**
 * Created by zcf on 2016/12/20.
 */
BI.MultiTreeList = BI.inherit(BI.Widget, {
    constants: {
        offset: {
            left: 1,
            top: 0,
            right: 2,
            bottom: 1
        }
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-tree-combo',
            itemsCreator: BI.emptyFn,
            height: 25
        });
    },

    _init: function () {
        BI.MultiTreeList.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        var isInit = false;
        var want2showCounter = false;

        this.popup = BI.createWidget({
            type: "bi.multi_tree_list_popup",
            itemsCreator: o.itemsCreator
        });

        this.popup.on(BI.MultiStringListPopup.EVENT_AFTER_INIT, function () {
            self.trigger.getCounter().adjustView();
            isInit = true;
            if (want2showCounter === true) {
                showCounter();
            }
        });

        this.trigger = BI.createWidget({
            type: "bi.multi_select_trigger",
            height: o.height,
            adapter: this.popup,
            masker: {
                offset: this.constants.offset
            },
            searcher: {
                type: "bi.multi_tree_searcher",
                itemsCreator: o.itemsCreator
            },
            switcher: {
                el: {
                    type: "bi.multi_tree_check_selected_button"
                },
                popup: {
                    type: "bi.multi_tree_check_pane",
                    itemsCreator: o.itemsCreator
                }
            }
        });

        this.storeValue = {value: {}};

        var isSearching = function () {
            return self.trigger.getSearcher().isSearching();
        };

        this.trigger.on(BI.MultiSelectTrigger.EVENT_START, function () {
            self.storeValue = {value: self.popup.getValue()};
            this.setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_STOP, function () {
            self.storeValue = {value: this.getValue()};
            self.trigger.setValue(self.storeValue);
            self.popup.setValue(self.storeValue);
            BI.nextTick(function () {
                self.trigger.populate();
                self.popup.populate();
            });
        });
        function showCounter() {
            if (isSearching()) {
                self.storeValue = {value: self.trigger.getValue()};
            } else {
                self.storeValue = {value: self.popup.getValue()};
            }
            self.trigger.setValue(self.storeValue);
        }

        this.trigger.on(BI.MultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW, function () {
            if (want2showCounter === false) {
                want2showCounter = true;
            }
            if (isInit === true) {
                want2showCounter = null;
                showCounter();
            }
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_CHANGE, function () {
            var val = {
                type: BI.Selection.Multi,
                value: this.getSearcher().hasChecked() ? {1: 1} : {}
            };
            this.getSearcher().setState(val);
            this.getCounter().setButtonChecked(val);
        });

        this.popup.on(BI.MultiStringListPopup.EVENT_CHANGE, function () {
            showCounter();
            var val = {
                type: BI.Selection.Multi,
                value: this.hasChecked() ? {1: 1} : {}
            };
            self.trigger.getSearcher().setState(val);
            self.trigger.getCounter().setButtonChecked(val);
            self.fireEvent(BI.MultiTreeList.EVENT_CHANGE);
        });

        var div = BI.createWidget({
            type: "bi.layout"
        });
        BI.createWidget({
            type: "bi.vtape",
            element: this.element,
            height: "100%",
            width: "100%",
            items: [{
                el: this.trigger,
                height: 25
            }, {
                el: div,
                height: 2
            }, {
                el: this.popup,
                height: "fill"
            }]
        })
    },

    _defaultState: function () {
        this.trigger.stopEditing();
    },

    resize: function () {
        this.trigger.getCounter().adjustView();
        this.trigger.getSearcher().adjustView();
    },

    setEnable: function (v) {
        this.trigger.setEnable(v);
        this.popup.setEnable(v);
    },

    setValue: function (v) {
        this.storeValue.value = v || {};
        this.popup.setValue({
            value: v || {}
        });
        this.trigger.setValue({
            value: v || {}
        });
    },

    getValue: function () {
        return this.storeValue.value;
    },

    populate: function () {
        this.trigger.populate.apply(this.trigger, arguments);
        this.popup.populate.apply(this.popup, arguments);
    }
});
BI.MultiTreeList.EVENT_CHANGE = "MultiTreeList.EVENT_CHANGE";
$.shortcut('bi.multi_tree_list', BI.MultiTreeList);