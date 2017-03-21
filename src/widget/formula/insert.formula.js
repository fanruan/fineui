/**
 * Created by roy on 15/9/9.
 */
//0更多函数为展开状态，1为函数框展开，显示返回状态
BI.FormulaInsert = BI.inherit(BI.Widget, {
    constants: {
        right_set_off: -322,
        height: 30,
        width: 160,
        right: 10,
        button_bottom: 5,
        pane_bottom: -1,
        retract: 1,
        more_function: 0,
        functionTypes: ["MATH", "DATETIME", "ARRAY", "TEXT", "LOGIC", "OTHER"],
        abandonFunctions: ["ACOS", "ACOSH", "ASIN", "ASINH", "ATAN", "ATAN2", "ATANH", "BITNOT", "BITOPERATION", "CHAR", "CLASS", "CODE", "COMBIN", "CORREL", "COS", "COSH", "DATETONUMBER", "DEGREES", "GETKEY", "GETUSERDEPARTMENTS", "GETUSERJOBTITLES", "NVL", "ODD", "PI", "POWER", "PRODUCT", "PROPER", "RADIANS", "REGEXP", "REVERSE", "RemoteIP", "SIN", "SINH", "STARTWITH", "TAN", "TANH", "TESTCONNECTION", "TESTMACANDUUID", "TOBINARY", "TOHEX", "TOOCTAL", "TOIMAGE"]
    },

    _defaultConfig: function () {
        var conf = BI.FormulaInsert.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-formula-insert",
            fieldItems: []


        })
    },

    _init: function () {
        BI.FormulaInsert.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this.constants;
        self.validation = "valid";

        this.formulatree = BI.createWidget({
            type: "bi.formula_field_tree",
            cls: "bi-formula-field-pane",
            items: o.fieldItems
        });

        this.formulatree.on(BI.FormulaFieldTree.EVENT_CHANGE, function () {
            var v = self.formulatree.getValue();
            self.formulaedit.insertField(self.fieldValueTextMap[v[0]]);
        });

        this.symbolgroup = BI.createWidget({
            type: "bi.symbol_group",
            height: c.height,
            cls: "symbol-group-column"
        });

        this.symbolgroup.on(BI.SymbolGroup.EVENT_CHANGE, function (v) {
            self.formulaedit.insertOperator(v);
        });


        this.formulaedit = BI.createWidget({
            type: "bi.formula",
            tipType: "warning",
            watermark: BI.i18nText("BI-Formula_Water_Mark")
        });

        this.formulaedit.on(BI.FormulaEditor.EVENT_CHANGE, function () {
            if (BI.Func.checkFormulaValidation(self.formulaedit.getCheckString())) {
                self.validation = "valid";
                BI.Bubbles.hide(self.getName() + "invalid");
            } else {
                BI.Bubbles.show(self.getName() + "invalid", BI.i18nText("BI-Formula_Valid"), self, {
                    offsetStyle: "center"
                });
                self.validation = "invalid"
            }
            self.fireEvent(BI.FormulaInsert.EVENT_CHANGE);
        });

        this.formulaedit.on(BI.FormulaEditor.EVENT_BLUR, function () {
            BI.Bubbles.hide(self.getName() + "invalid");
            if (!self.checkValidation()) {
                self.formulaedit.setTitle(BI.i18nText("BI-Formula_Valid"), {belowMouse: true});
            }


        });

        this.formulaedit.on(BI.FormulaEditor.EVENT_FOCUS, function () {
            self.formulaedit.setTitle("");
            if (!self.checkValidation()) {
                BI.Bubbles.show(self.getName() + "invalid", BI.i18nText("BI-Formula_Valid"), self, {offsetStyle: "center"});
            }
        });

        this.editorpane = BI.createWidget({
            type: "bi.vtape",

            items: [
                {
                    height: "fill",
                    el: self.formulaedit
                }, {
                    height: c.height,
                    el: self.symbolgroup
                }
            ]
        });


        this.functionbutton = BI.createWidget({
            type: "bi.text_button",
            text: BI.i18nText("BI-Formula_More_Function"),
            value: c.more_function,
            cls: "more-function-button"
        });

        this.functionpane = BI.createWidget({
            type: "bi.function_pane",
            items: self._createFunctionItems(),
        });

        this.functionCombo = BI.createWidget({
            type: "bi.combo",
            isNeedAdjustWidth: false,
            el: this.functionbutton,
            direction: "right,top",
            adjustYOffset: -16,
            adjustXOffset: 10,
            hideChecker: function () {
                return false;
            },
            popup: {
                el: self.functionpane,
                width: 372
            },
            width: 65
        });


        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    width: c.width,
                    el: self.formulatree
                },
                {

                    el: self.editorpane
                }
            ],
            height: o.height,
            width: o.width
        });
        BI.createWidget({
            element: this,
            type: "bi.absolute",
            items: [
                {
                    el: self.functionCombo,
                    right: c.right,
                    bottom: c.button_bottom
                }
            ]
        });


        self.formulaedit.element.droppable({
            accept: ".bi-tree-text-leaf-item",
            drop: function (event, ui) {
                var value = ui.helper.attr("text");
                self.formulaedit.insertField(value);
            }
        });


        this.functionCombo.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self.functionbutton.setText(BI.i18nText("BI-Formula_Retract"))
        });

        this.functionCombo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.functionbutton.setText(BI.i18nText("BI-Formula_More_Function"))
        });

        this.functionpane.on(BI.FunctionPane.EVENT_INSET, function (v) {
            if (BI.isNotEmptyString(v)) {
                self.formulaedit.insertFunction(v);
            }

        });

        this.populate(o.fieldItems);

    },


    _isFunction: function (str) {
        var self = this, o = this.options, result = false;
        BI.each(o.functionItems, function (i, item) {
            var text = item.text.toLowerCase();
            var lowerString = str.toLowerCase();
            if (text === lowerString) {
                result = true
            }
        });
        return result;
    },

    _analyzeContent: function (v) {
        var regx = /\$[\{][^\}]*[\}]|\w*\w|\$\{[^\$\(\)\+\-\*\/)\$,]*\w\}|\$\{[^\$\(\)\+\-\*\/]*\w\}|\$\{[^\$\(\)\+\-\*\/]*[\u4e00-\u9fa5]\}|\w|(.)|\n/g;
        return v.match(regx);
    },

    _getFunctionType: function (functionType) {
        switch (functionType) {
            case  "MATH":
                return BICst.FUNCTION.MATH;
            case "TEXT":
                return BICst.FUNCTION.TEXT;
            case "DATETIME":
                return BICst.FUNCTION.DATE;
            case "ARRAY":
                return BICst.FUNCTION.ARRAY;
            case "LOGIC":
                return BICst.FUNCTION.LOGIC;
            case "OTHER":
                return BICst.FUNCTION.OTHER;
        }
    },

    _createFunctionItems: function () {
        var self = this;
        var functionObjs = FormulaJSONs;
        var functionItems = [];
        BI.each(functionObjs, function (i, functionObj) {
            if (self.constants.functionTypes.contains(functionObj.type) && !self.constants.abandonFunctions.contains(functionObj.name)) {
                var item = {};
                item.text = functionObj.name;
                item.value = functionObj.name;
                item.fieldType = self._getFunctionType(functionObj.type);
                item.description = functionObj.def;
                item.title = functionObj.def;
                functionItems.push(item);
            }
        });
        this.options.functionItems = functionItems;
        return functionItems;
    },

    _createFieldTextValueMap: function (fieldItems) {
        var fieldMap = {};
        BI.each(fieldItems, function(idx, typeItems){
            BI.each(typeItems, function (i, fieldItem) {
                fieldMap[fieldItem.text] = fieldItem.value;
            });
        })
        return fieldMap;
    },

    _createFieldValueTextMap: function (fieldItems) {
        var fieldMap = {};
        BI.each(fieldItems, function (idx, typeItems) {
            BI.each(typeItems, function (i, fieldItem) {
                fieldMap[fieldItem.value] = fieldItem.text;
            })
        });
        return fieldMap;
    },

    _bindDragEvent: function () {
        var self = this;
        BI.each(self.formulatree.getAllLeaves(), function (i, node) {
            node.element.draggable({
                cursorAt: {top: 5, left: 5},
                helper: function () {
                    var hint = BI.createWidget({
                        type: "bi.helper",
                        value: node.getValue(),
                        text: self.fieldValueTextMap[node.getValue()]
                    });
                    BI.createWidget({
                        element: self,
                        type: "bi.default",
                        items: [hint]
                    });
                    hint.element.attr({text: self.fieldValueTextMap[node.getValue()]});
                    return hint.element;

                }
            })

        });
    },


    checkValidation: function () {
        return this.validation === "valid";
    },

    refresh: function () {
        this.formulaedit.refresh();
    },

    setValue: function (v) {
        var self = this, result;
        self.formulaedit.refresh();
        self.formulaedit.setValue("");
        result = this._analyzeContent(v || "");
        BI.each(result, function (i, item) {
            var fieldRegx = /\$[\{][^\}]*[\}]/;
            var str = item.match(fieldRegx);
            if (BI.isNotEmptyArray(str)) {
                self.formulaedit.insertField(self.fieldValueTextMap[str[0].substring(2, item.length - 1)]);
            } else if (self._isFunction(item)) {
                self.formulaedit.setFunction(item);
            } else {
                self.formulaedit.insertString(item);
            }
        })

    },

    getFormulaString: function () {
        return this.formulaedit.getFormulaString();
    },

    getUsedFields: function () {
        return this.formulaedit.getUsedFields();
    },

    getValue: function () {
        return this.formulaedit.getValue();
    },
    populate: function (fieldItems) {
        this.options.fieldItems = fieldItems;
        this.fieldTextValueMap = this._createFieldTextValueMap(fieldItems);
        this.fieldValueTextMap = this._createFieldValueTextMap(fieldItems);
        this.formulaedit.setFieldTextValueMap(this.fieldTextValueMap);
        this.formulatree.populate(fieldItems);
        this._bindDragEvent();
    }


});
BI.FormulaInsert.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.formula_insert", BI.FormulaInsert);