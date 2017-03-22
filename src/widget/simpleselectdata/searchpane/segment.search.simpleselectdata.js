/**
 * search面板选项栏
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SimpleSelectDataSearchSegment
 * @extends BI.Widget
 */
BI.SimpleSelectDataSearchSegment = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SimpleSelectDataSearchSegment.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-data-search-segment",
            height: 30,
            items: [{
                text: BI.i18nText("BI-Basic_Field"),
                selected: true,
                value: BI.SelectDataSearchSegment.SECTION_FIELD
            }, {
                text: BI.i18nText("BI-Basic_Table"),
                value: BI.SelectDataSearchSegment.SECTION_TABLE
            }]
        });
    },

    _init: function () {
        BI.SimpleSelectDataSearchSegment.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.segment = BI.createWidget({
            type: "bi.segment",
            height: 20,
            cls: "search-segment-field-table",
            items: o.items
        });
        this.segment.on(BI.Segment.EVENT_CHANGE, function(){
            self.fireEvent(BI.SimpleSelectDataSearchSegment.EVENT_CHANGE);
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [{
                type: "bi.absolute",
                height: o.height,
                items: [{
                    el: this.segment,
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5
                }]
            }]
        });
    },

    setValue: function (v) {
        var self = this;
        BI.each([BI.SelectDataSearchSegment.SECTION_FIELD,
            BI.SelectDataSearchSegment.SECTION_TABLE], function (i, key) {
            if (key & v) {
                self.segment.setValue(key & v);
            }
        });
    },

    getValue: function () {
        return this.segment.getValue()[0]
    }
});

BI.SimpleSelectDataSearchSegment.EVENT_CHANGE = "SimpleSelectDataSearchSegment.EVENT_CHANGE";
$.shortcut('bi.simple_select_data_search_segment', BI.SimpleSelectDataSearchSegment);