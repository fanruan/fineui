/**
 *
 * 复选下拉框
 * @class BI.MultiSelectInsertTrigger
 * @extends BI.Trigger
 */

BI.MultiSelectInsertTrigger = BI.inherit(BI.Trigger, {

    constants: {
        height: 14,
        rgap: 4,
        lgap: 4
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectInsertTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-trigger",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            itemHeight: 24,
            searcher: {},
            switcher: {},

            adapter: null,
            masker: {},
            allowEdit: true
        });
    },

    _init: function () {
        BI.MultiSelectInsertTrigger.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.searcher = BI.createWidget(o.searcher, {
            type: "bi.multi_select_insert_searcher",
            height: o.height,
            text: o.text,
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            itemHeight: o.itemHeight,
            watermark: o.watermark,
            popup: {},
            adapter: o.adapter,
            masker: o.masker,
            value: o.value
        });
        this.searcher.on(BI.MultiSelectInsertSearcher.EVENT_START, function () {
            self.fireEvent(BI.MultiSelectInsertTrigger.EVENT_START);
        });
        this.searcher.on(BI.MultiSelectInsertSearcher.EVENT_PAUSE, function () {
            self.fireEvent(BI.MultiSelectInsertTrigger.EVENT_PAUSE);
        });
        this.searcher.on(BI.MultiSelectInsertSearcher.EVENT_SEARCHING, function () {
            self.fireEvent(BI.MultiSelectInsertTrigger.EVENT_SEARCHING, arguments);
        });
        this.searcher.on(BI.MultiSelectInsertSearcher.EVENT_STOP, function () {
            self.fireEvent(BI.MultiSelectInsertTrigger.EVENT_STOP);
        });
        this.searcher.on(BI.MultiSelectInsertSearcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectInsertTrigger.EVENT_CHANGE, arguments);
        });
        this.searcher.on(BI.MultiSelectInsertSearcher.EVENT_BLUR, function () {
            self.fireEvent(BI.MultiSelectInsertTrigger.EVENT_BLUR);
        });
        this.searcher.on(BI.MultiSelectInsertSearcher.EVENT_FOCUS, function () {
            self.fireEvent(BI.MultiSelectInsertTrigger.EVENT_FOCUS);
        });

        this.wrapNumberCounter = BI.createWidget({
            type: "bi.layout"
        });

        this.wrapper = BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [
                {
                    el: this.searcher,
                    width: "fill"
                }, {
                    el: this.wrapNumberCounter,
                    width: 0
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

    /**
     * 重新调整numberCounter的空白占位符
     */
    refreshPlaceHolderWidth: function(width) {
        this.wrapper.attr("items")[1].width = width;
        this.wrapper.resize();
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

    setValue: function (ob) {
        this.searcher.setValue(ob);
    },

    getKey: function () {
        return this.searcher.getKey();
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});

BI.MultiSelectInsertTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.MultiSelectInsertTrigger.EVENT_COUNTER_CLICK = "EVENT_COUNTER_CLICK";
BI.MultiSelectInsertTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiSelectInsertTrigger.EVENT_START = "EVENT_START";
BI.MultiSelectInsertTrigger.EVENT_STOP = "EVENT_STOP";
BI.MultiSelectInsertTrigger.EVENT_PAUSE = "EVENT_PAUSE";
BI.MultiSelectInsertTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.MultiSelectInsertTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW = "EVENT_BEFORE_COUNTER_POPUPVIEW";
BI.MultiSelectInsertTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.MultiSelectInsertTrigger.EVENT_BLUR = "EVENT_BLUR";

BI.shortcut("bi.multi_select_insert_trigger", BI.MultiSelectInsertTrigger);