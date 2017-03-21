/**
 * search面板选项栏
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SelectDataSearchSegment
 * @extends BI.Widget
 */
BI.SelectDataSearchSegment = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataSearchSegment.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-search-segment",
            height: 60
        });
    },

    //创建所有数据和业务包选项
    _createSectionTab: function () {
        var self = this;
        this.pack = BI.createWidget({
            type: "bi.line_segment_button",
            height: 24,
            selected: true,
            text: BI.i18nText("BI-Current_Package"),
            value: BI.SelectDataSearchSegment.SECTION_PACKAGE
        });
        this.all = BI.createWidget({
            type: "bi.line_segment_button",
            height: 24,
            text: BI.i18nText("BI-All_Data"),
            value: BI.SelectDataSearchSegment.SECTION_ALL
        });

        this.button_group = BI.createWidget({
            type: "bi.line_segment",
            height: 25,
            items: [this.all, this.pack]
        });

        this.button_group.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearchSegment.EVENT_CHANGE);
        });
        return this.button_group;
    },

    _createSegmet: function () {
        var self = this;
        this.segment = BI.createWidget({
            type: "bi.segment",
            height: 20,
            cls: "search-segment-field-table",
            items: [{
                text: BI.i18nText("BI-Basic_Field"),
                selected: true,
                value: BI.SelectDataSearchSegment.SECTION_FIELD
            }, {
                text: BI.i18nText("BI-Basic_Table"),
                value: BI.SelectDataSearchSegment.SECTION_TABLE
            }]
        });
        this.segment.on(BI.Segment.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearchSegment.EVENT_CHANGE);
        });
        return this.segment;
    },

    _init: function () {
        BI.SelectDataSearchSegment.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this._createSectionTab(), {
                type: "bi.absolute",
                height: 35,
                items: [{
                    el: this._createSegmet(),
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 5
                }]
            }]
        });
    },

    setValue: function (v) {
        var self = this;
        BI.each([BI.SelectDataSearchSegment.SECTION_ALL,
            BI.SelectDataSearchSegment.SECTION_PACKAGE], function (i, key) {
            if (key & v) {
                self.button_group.setValue(key & v);
            }
        });
        BI.each([BI.SelectDataSearchSegment.SECTION_FIELD,
            BI.SelectDataSearchSegment.SECTION_TABLE], function (i, key) {
            if (key & v) {
                self.segment.setValue(key & v);
            }
        });
    },

    getValue: function () {
        return this.button_group.getValue()[0] | this.segment.getValue()[0]
    }
});

BI.extend(BI.SelectDataSearchSegment, {
    SECTION_ALL: 0x1,
    SECTION_PACKAGE: 0x10,
    SECTION_FIELD: 0x100,
    SECTION_TABLE: 0x1000
});
BI.SelectDataSearchSegment.EVENT_CHANGE = "SelectDataSearchSegment.EVENT_CHANGE";
$.shortcut('bi.select_data_search_segment', BI.SelectDataSearchSegment);