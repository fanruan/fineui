/**
 * 普通控件
 *
 * @class BI.Param0DateItem
 * @extends BI.Single
 */
BI.Param0DateItem = BI.inherit(BI.Single, {
    constants: {
        itemHeight: 20,
        itemWidth: 20,
        textWidth: 40,
        comboWidth: 45
    },

    _defaultConfig: function () {
        return BI.extend(BI.Param0DateItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-param0-date-item',
            width: 310,
            height: 20,
            selected: false,
            defaultEditorValue: "0"
        });
    },

    _init: function () {
        BI.Param0DateItem.superclass._init.apply(this, arguments);
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

        this.firstCombo = BI.createWidget({
            type: "bi.small_text_value_combo",
            width: this.constants.comboWidth,
            height: this.constants.itemHeight,
            items: BICst.BEFORE_AFTER_COMBO
        });

        this.firstCombo.setValue(0);

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
                text: BI.i18nText("BI-Year"),
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
                type: "bi.label",
                textAlign: "left",
                cls: 'param-label',
                text: BI.i18nText("BI-Year_Fen"),
                height: this.constants.itemHeight,
                lgap: 5
            }]
        });
    },

    _assertValue: function(v){
        var o = this.options;
        v = v || {};
        v.fvalue = v.fvalue || o.defaultEditorValue;
        v.foffset = v.foffset || 0;
        return v;
    },

    setSelected: function (v) {
        this.radio.setSelected(!!v);
    },

    isSelected: function () {
        return this.radio.isSelected();
    },

    getInputValue: function () {
        return {
            fvalue: this.firstEditor.getValue() || 0,
            foffset: this.firstCombo.getValue()[0]
        };
    },

    setInputValue: function (v) {
        v = this._assertValue(v);
        this.firstEditor.setValue(v.fvalue);
        this.firstCombo.setValue([v.foffset]);
    },

    getValue: function(){
        return BICst.YEAR;
    },

    setEnable: function (b) {
        this.firstEditor.setEnable(!!b);
        this.firstCombo.setEnable(!!b);
    }
});

BI.Param0DateItem.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.param0_date_item', BI.Param0DateItem);