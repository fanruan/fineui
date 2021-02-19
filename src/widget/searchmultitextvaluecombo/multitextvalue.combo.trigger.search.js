BI.SearchMultiSelectTrigger = BI.inherit(BI.Trigger, {

    constants: {
        height: 14,
        rgap: 4,
        lgap: 4
    },

    _defaultConfig: function () {
        return BI.extend(BI.SearchMultiSelectTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-trigger",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            searcher: {},
            switcher: {},

            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.SearchMultiSelectTrigger.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.searcher = BI.createWidget(o.searcher, {
            type: "bi.search_multi_select_searcher",
            height: o.height,
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            allValueGetter: o.allValueGetter,
            popup: {},
            adapter: o.adapter,
            masker: o.masker,
            value: o.value,
            text: o.text,
            tipType: o.tipType,
            warningTitle: o.warningTitle
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_START, function () {
            self.fireEvent(BI.SearchMultiSelectTrigger.EVENT_START);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_PAUSE, function () {
            self.fireEvent(BI.SearchMultiSelectTrigger.EVENT_PAUSE);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_SEARCHING, function () {
            self.fireEvent(BI.SearchMultiSelectTrigger.EVENT_SEARCHING, arguments);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_STOP, function () {
            self.fireEvent(BI.SearchMultiSelectTrigger.EVENT_STOP);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.SearchMultiSelectTrigger.EVENT_CHANGE, arguments);
        });
        this.numberCounter = BI.createWidget(o.switcher, {
            type: "bi.multi_select_check_selected_switcher",
            valueFormatter: o.valueFormatter,
            itemsCreator: o.itemsCreator,
            adapter: o.adapter,
            masker: o.masker,
            value: o.value
        });
        this.numberCounter.on(BI.MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE, function () {
            self.fireEvent(BI.SearchMultiSelectTrigger.EVENT_COUNTER_CLICK);
        });
        this.numberCounter.on(BI.MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.SearchMultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW);
        });

        var wrapNumberCounter = BI.createWidget({
            type: "bi.right_vertical_adapt",
            hgap: 4,
            items: [{
                el: this.numberCounter
            }]
        });

        var wrapper = BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [
                {
                    el: this.searcher,
                    width: "fill"
                }, {
                    el: wrapNumberCounter,
                    width: 0
                }, {
                    el: BI.createWidget(),
                    width: 24
                }]
        });

        this.numberCounter.on(BI.Events.VIEW, function (b) {
            BI.nextTick(function () {// 自动调整宽度
                wrapper.attr("items")[1].width = (b === true ? self.numberCounter.element.outerWidth() + 8 : 0);
                wrapper.resize();
            });
        });

        this.element.click(function (e) {
            if (self.element.find(e.target).length > 0) {
                self.numberCounter.hideView();
            }
        });
    },

    getCounter: function () {
        return this.numberCounter;
    },

    getSearcher: function () {
        return this.searcher;
    },

    stopEditing: function () {
        this.searcher.stopSearch();
        this.numberCounter.hideView();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
        this.numberCounter.setAdapter(adapter);
    },

    setValue: function (ob) {
        this.searcher.setValue(ob);
        this.numberCounter.setValue(ob);
    },

    setTipType: function (v) {
        this.searcher.setTipType(v);
    },

    getKey: function () {
        return this.searcher.getKey();
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});

BI.SearchMultiSelectTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.SearchMultiSelectTrigger.EVENT_COUNTER_CLICK = "EVENT_COUNTER_CLICK";
BI.SearchMultiSelectTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.SearchMultiSelectTrigger.EVENT_START = "EVENT_START";
BI.SearchMultiSelectTrigger.EVENT_STOP = "EVENT_STOP";
BI.SearchMultiSelectTrigger.EVENT_PAUSE = "EVENT_PAUSE";
BI.SearchMultiSelectTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.SearchMultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW = "EVENT_BEFORE_COUNTER_POPUPVIEW";

BI.shortcut("bi.search_multi_select_trigger", BI.SearchMultiSelectTrigger);
