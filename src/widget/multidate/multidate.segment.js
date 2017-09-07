/**
 * 普通控件
 *
 * @class BI.MultiDateSegment
 * @extends BI.Single
 */
BI.MultiDateSegment = BI.inherit(BI.Single, {
    constants: {
        itemHeight: 24,
        maxGap: 15,
        minGap: 10,
        textWidth: 30,
        defaultEditorValue: "1"
    },

    _defaultConfig: function () {
        return $.extend(BI.MultiDateSegment.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multidate-segment',
            text: "",
            width: 130,
            height: 30,
            isEditorExist: true,
            selected: false,
            defaultEditorValue: "1"
        });
    },

    _init: function () {
        BI.MultiDateSegment.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.radio = BI.createWidget({
            type: "bi.radio",
            selected: opts.selected
        });
        this.radio.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.textEditor = BI.createWidget({
            type: 'bi.text_editor',
            value: this.constants.defaultEditorValue,
            title: function () {
                return self.textEditor.getValue();
            },
            cls: 'bi-multidate-editor',
            width: this.constants.textWidth,
            height: this.constants.itemHeight
        });
        this.textEditor.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            cls: 'bi-multidate-normal-label',
            text: opts.text,
            height: this.constants.itemHeight
        });
        this._createSegment();
    },
    _createSegment: function () {
        if (this.options.isEditorExist === true) {
            return BI.createWidget({
                element: this,
                type: 'bi.left',
                items: [{
                    el: {
                        type: "bi.center_adapt",
                        items: [this.radio],
                        height: this.constants.itemHeight
                    },
                    lgap: 0
                },
                    {
                        el: {
                            type: "bi.center_adapt",
                            items: [this.textEditor],
                            widgetName: 'textEditor'
                        },
                        lgap: this.constants.maxGap
                    },
                    {
                        el: this.text,
                        lgap: this.constants.minGap
                    }]
            });
        }
        return BI.createWidget({
            element: this,
            type: 'bi.left',
            items: [{
                el: {
                    type: "bi.center_adapt",
                    items: [this.radio],
                    height: this.constants.itemHeight
                },
                lgap: 0
            },
                {
                    el: this.text,
                    lgap: this.constants.maxGap
                }]
        })
    },
    setSelected: function (v) {
        if (BI.isNotNull(this.radio)) {
            this.radio.setSelected(v);
            this.textEditor.setEnable(v);
        }
    },
    isSelected: function () {
        return this.radio.isSelected();
    },
    getValue: function () {
        return this.options.value;
    },
    getInputValue: function () {
        return this.textEditor.getValue() | 0;
    },
    setInputValue: function (v) {
        this.textEditor.setValue(v);
    },
    isEditorExist: function () {
        return this.options.isEditorExist;
    }
});
BI.MultiDateSegment.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.multidate_segment', BI.MultiDateSegment);