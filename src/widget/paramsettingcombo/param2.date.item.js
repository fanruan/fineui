/**
 * 普通控件
 *
 * @class BI.Param2DateItem
 * @extends BI.Single
 */
BI.Param2DateItem = BI.inherit(BI.Single, {
    constants: {
        itemHeight: 20,
        itemWidth: 20,
        textWidth: 40,
        comboWidth: 45
    },

    _defaultConfig: function () {
        return BI.extend(BI.Param2DateItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-param2-date-item',
            value: BI.Param2DateItem.YEAR_DAY,
            width: 310,
            height: 20,
            selected: false,
            defaultEditorValue: "0"
        });
    },

    _init: function () {
        BI.Param2DateItem.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.radio = BI.createWidget({
            type: "bi.radio",
            selected: opts.selected
        });
        this.radio.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.firstEditor = BI.createWidget({
            type: 'bi.small_text_editor',
            value: opts.defaultEditorValue,
            validationChecker: function(v){
                return BI.isNaturalNumber(v);
            },
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: this.constants.textWidth,
            height: this.constants.itemHeight
        });
        this.firstEditor.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.secondEditor = BI.createWidget({
            type: 'bi.small_text_editor',
            value: opts.defaultEditorValue,
            validationChecker: function(v){
                return BI.isNaturalNumber(v);
            },
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: this.constants.textWidth,
            height: this.constants.itemHeight
        });
        this.secondEditor.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.firstCombo = BI.createWidget({
            type: "bi.small_text_value_combo",
            width: this.constants.comboWidth,
            height: this.constants.itemHeight,
            items: BICst.BEFORE_AFTER_COMBO
        });
        this.secondCombo = BI.createWidget({
            type: "bi.small_text_value_combo",
            width: this.constants.comboWidth,
            height: this.constants.itemHeight,
            items: BICst.BEFORE_AFTER_COMBO
        });
        this.firstCombo.setValue(0);
        this.secondCombo.setValue(0);
        var textJson = this._getTextByDateType();

        BI.createWidget({
            type: 'bi.inline',
            element: this,
            items: [{
                type: "bi.center_adapt",
                items: [this.radio],
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, this.firstEditor, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: textJson.ftext,
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, this.firstCombo, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: BI.i18nText("BI-Basic_De"),
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, {
                el: this.secondCombo,
                rgap: 5
            }, this.secondEditor, {
                type: "bi.label",
                textAlign: "left",
                cls: 'param-label',
                text: textJson.stext,
                height: this.constants.itemHeight,
                lgap: 5
            }]
        });
    },

    _getTextByDateType: function(){
        switch (this.options.value) {
            case BI.Param2DateItem.MONTH_WEEK:
                return {ftext: BI.i18nText("BI-Basic_Month"), stext: BI.i18nText("BI-Week_Of_Week")};
            case BI.Param2DateItem.MONTH_DAY:
                return {ftext: BI.i18nText("BI-Basic_Month"), stext: BI.i18nText("BI-Day_De")};
            case BI.Param2DateItem.YEAR_MONTH:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Month_De_Month")};
            case BI.Param2DateItem.YEAR_DAY:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Day_De")};
            case BI.Param2DateItem.YEAR_QUARTER:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Quarter_Of_Quarter")};
            case BI.Param2DateItem.YEAR_WEEK:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Week_Of_Week")};
        }
    },

    _assertValue: function(v){
        var o = this.options;
        v = v || {};
        v.fvalue = v.fvalue || o.defaultEditorValue;
        v.foffset = v.foffset || 0;
        v.svalue = v.svalue || o.defaultEditorValue;
        v.soffset = v.soffset || 0;
        return v;
    },

    setSelected: function (v) {
        this.radio.setSelected(!!v);
    },

    isSelected: function () {
        return this.radio.isSelected();
    },

    getValue: function () {
        return this.options.value;
    },

    getInputValue: function(){
        return {
            fvalue: this.firstEditor.getValue() || 0,
            foffset: this.firstCombo.getValue()[0],
            svalue: this.secondEditor.getValue() || 0,
            soffset: this.secondCombo.getValue()[0]
        };
    },

    setInputValue: function (v) {
        v = this._assertValue(v);
        this.firstEditor.setValue(v.fvalue);
        this.firstCombo.setValue([v.foffset]);
        this.secondEditor.setValue(v.svalue);
        this.secondCombo.setValue([v.soffset]);
    },

    setEnable: function (b) {
        this.firstEditor.setEnable(!!b);
        this.secondEditor.setEnable(!!b);
        this.firstCombo.setEnable(!!b);
        this.secondCombo.setEnable(!!b);
    }
});

BI.Param2DateItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.extend(BI.Param2DateItem , {
    YEAR_QUARTER: BICst.YEAR_QUARTER,
    YEAR_MONTH: BICst.YEAR_MONTH,
    YEAR_WEEK: BICst.YEAR_WEEK,
    YEAR_DAY: BICst.YEAR_DAY,
    MONTH_WEEK: BICst.MONTH_WEEK,
    MONTH_DAY: BICst.MONTH_DAY
});
$.shortcut('bi.param2_date_item', BI.Param2DateItem);