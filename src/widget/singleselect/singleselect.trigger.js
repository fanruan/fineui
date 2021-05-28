/**
 *
 * 单选下拉框
 * @class BI.SingleSelectTrigger
 * @extends BI.Trigger
 */

BI.SingleSelectTrigger = BI.inherit(BI.Trigger, {

    constants: {
        height: 14,
        rgap: 4,
        lgap: 4
    },

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-trigger",
            allowNoSelect: false,
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            searcher: {},
            switcher: {},

            adapter: null,
            masker: {},
            allowEdit: true
        });
    },

    _init: function () {
        BI.SingleSelectTrigger.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.searcher = BI.createWidget(o.searcher, {
            type: "bi.single_select_searcher",
            watermark: o.watermark,
            allowNoSelect: o.allowNoSelect,
            text: o.text,
            height: o.height,
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            popup: {},
            adapter: o.adapter,
            masker: o.masker,
            value: o.value
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_START, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_START);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_PAUSE, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_PAUSE);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_SEARCHING, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_SEARCHING, arguments);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_STOP, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_STOP);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_CHANGE, arguments);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_FOCUS, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_FOCUS);
        });
        this.searcher.on(BI.SingleSelectSearcher.EVENT_BLUR, function () {
            self.fireEvent(BI.SingleSelectTrigger.EVENT_BLUR, arguments);
        });

        var wrapper = BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [
                {
                    el: this.searcher,
                    width: "fill"
                }, {
                    el: BI.createWidget(),
                    width: 24
                }]
        });

        !o.allowEdit && BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.text",
                    title: function () {
                        return self.searcher.getState();
                    }
                },
                left: 0,
                right: 24,
                top: 0,
                bottom: 0
            }]
        });
    },

    getSearcher: function () {
        return this.searcher;
    },

    stopEditing: function () {
        this.searcher.stopSearch();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
    },

    setValue: function (v) {
        this.searcher.setValue(v);
    },

    getKey: function () {
        return this.searcher.getKey();
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});

BI.SingleSelectTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.SingleSelectTrigger.EVENT_COUNTER_CLICK = "EVENT_COUNTER_CLICK";
BI.SingleSelectTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.SingleSelectTrigger.EVENT_START = "EVENT_START";
BI.SingleSelectTrigger.EVENT_STOP = "EVENT_STOP";
BI.SingleSelectTrigger.EVENT_PAUSE = "EVENT_PAUSE";
BI.SingleSelectTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.SingleSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW = "EVENT_BEFORE_COUNTER_POPUPVIEW";
BI.SingleSelectTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.SingleSelectTrigger.EVENT_BLUR = "EVENT_BLUR";

BI.shortcut("bi.single_select_trigger", BI.SingleSelectTrigger);