/**
 * guy
 * @class BI.Input 一个button和一行数 组成的一行listitem
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.Input = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Input.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-input display-block",
            element: "<input/>",
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,//按确定键能否退出编辑
            mouseOut: false,
            allowBlank: false
        })
    },

    _init: function () {
        BI.Input.superclass._init.apply(this, arguments);
        var self = this;
        var _keydown = BI.debounce(function (keyCode) {
            self.onKeyDown(keyCode);
            self._keydown_ = false;
        }, 300);
        var _clk = BI.debounce(BI.bind(this._click, this), BI.EVENT_RESPONSE_TIME, true);
        this._blurDebounce = BI.debounce(BI.bind(this._blur, this), BI.EVENT_RESPONSE_TIME, true);
        this.element
            .keydown(function (e) {
                self.fireEvent(BI.Input.EVENT_QUICK_DOWN);
            })
            .keyup(function (e) {
                self._keydown_ = true;
                _keydown(e.keyCode);
            })
            .on("input propertychange", function (e) {
                self._keydown_ = true;
                _keydown(e.keyCode);
            })
            .click(function (e) {
                e.stopPropagation();
                _clk();
            })
            .mousedown(function (e) {
                self.element.val(self.element.val());
            })
            .focusout(function (e) {
                self._blurDebounce();
            });
    },

    _focus: function () {
        this.element.addClass("bi-input-focus");
        this._checkValidationOnValueChange();
        this._isEditing = true;
        if (this.getValue() == "") {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EMPTY, this.getValue(), this);
            this.fireEvent(BI.Input.EVENT_EMPTY);
        }
        this.fireEvent(BI.Input.EVENT_FOCUS);
    },

    _blur: function () {
        var self = this;
        if (self._keydown_ === true) {
            BI.delay(blur, 300);
        } else {
            blur();
        }
        function blur() {
            if (!self.isValid() && self.options.quitChecker.apply(self, [BI.trim(self.getValue())]) !== false) {
                self.element.val(self._lastValidValue ? self._lastValidValue : "");
                self._checkValidationOnValueChange();
                self._defaultState();
            }
            self.element.removeClass("bi-input-focus");
            self._isEditing = false;
            self._start = false;
            if (self.isValid()) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CONFIRM, self.getValue(), self);
                self.fireEvent(BI.Input.EVENT_CONFIRM);
            }
            self.fireEvent(BI.Input.EVENT_BLUR);
        }
    },

    _click: function () {
        if (this._isEditing !== true) {
            this._focus();
            this.selectAll();
            this.fireEvent(BI.Input.EVENT_CLICK);
        }
    },

    onClick: function () {
        this._click();
    },

    onKeyDown: function (keyCode) {
        if (!this.isValid() || BI.trim(this._lastValidValue) !== BI.trim(this.getValue())) {
            this._checkValidationOnValueChange();
        }
        if (keyCode == BI.keyCode.ENTER) {
            if (this.isValid() || this.options.quitChecker.apply(this, [BI.trim(this.getValue())]) !== false) {
                this.blur();
                this.fireEvent(BI.Input.EVENT_ENTER);
            } else {
                this.fireEvent(BI.Input.EVENT_RESTRICT);
            }
        }
        if (keyCode == BI.keyCode.SPACE) {
            this.fireEvent(BI.Input.EVENT_SPACE);
        }
        if (keyCode == BI.keyCode.BACKSPACE && this._lastValue == "") {
            this.fireEvent(BI.Input.EVENT_REMOVE);
        }
        if (keyCode == BI.keyCode.BACKSPACE || keyCode == BI.keyCode.DELETE) {
            this.fireEvent(BI.Input.EVENT_BACKSPACE);
        }
        this.fireEvent(BI.Input.EVENT_KEY_DOWN);

        if (this.isValid() && BI.trim(this.getValue()) !== "") {
            if (BI.trim(this.getValue()) !== this._lastValue && (!this._start || this._lastValue == null || this._lastValue === "")
                || (this._pause === true && !/(\s|\u00A0)$/.test(this.getValue()))) {
                this._start = true;
                this._pause = false;
                this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STARTEDIT, this.getValue(), this);
                this.fireEvent(BI.Input.EVENT_START);
            }
        }

        if (/(\s|\u00A0)$/.test(this.getValue())) {
            this._pause = true;
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.PAUSE, "", this);
            this.fireEvent(BI.Input.EVENT_PAUSE);
            this._defaultState();
        } else if ((keyCode === BI.keyCode.BACKSPACE || keyCode === BI.keyCode.DELETE) &&
            BI.trim(this.getValue()) === "" && (this._lastValue !== null && BI.trim(this._lastValue) !== "")) {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STOPEDIT, this.getValue(), this);
            this.fireEvent(BI.Input.EVENT_STOP);
            this._valueChange();
        } else {
            this._valueChange();
        }
    },

    //初始状态
    _defaultState: function () {
        if (this.getValue() == "") {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EMPTY, this.getValue(), this);
            this.fireEvent(BI.Input.EVENT_EMPTY);
        }
        this._lastValue = this.getValue();
        this._lastSubmitValue = null;
    },

    _valueChange: function () {
        if (this.isValid() && BI.trim(this.getValue()) !== this._lastSubmitValue) {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CHANGE, this.getValue(), this);
            this.fireEvent(BI.Input.EVENT_CHANGE);
            this._lastSubmitValue = BI.trim(this.getValue());
        }
        if (this.getValue() == "") {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EMPTY, this.getValue(), this);
            this.fireEvent(BI.Input.EVENT_EMPTY);
        }
        this._lastValue = this.getValue();
    },

    _checkValidationOnValueChange: function () {
        var o = this.options;
        var v = this.getValue();
        this.setValid(
            (o.allowBlank === true && BI.trim(v) == "") ||
            (BI.isNotEmptyString(BI.trim(v))
            && (v === this._lastValidValue ||
            o.validationChecker.apply(this, [BI.trim(v)]) !== false))
        );
    },

    focus: function () {
        if (!this.element.is(":visible")) {
            throw new Error("input输入框在不可见下不能focus");
        }
        if (!this._isEditing === true) {
            this.element.focus();
            this._focus();
            this.selectAll();
        }
    },

    blur: function () {
        if (!this.element.is(":visible")) {
            throw new Error("input输入框在不可见下不能blur");
        }
        if (this._isEditing === true) {
            this.element.blur();
            this._blurDebounce();
        }
    },

    selectAll: function () {
        if (!this.element.is(":visible")) {
            throw new Error("input输入框在不可见下不能select");
        }
        this.element.select();
        this._isEditing = true;
    },

    setValue: function (textValue) {
        this.element.val(textValue);
        BI.nextTick(BI.bind(function () {
            this._checkValidationOnValueChange();
            this._defaultState();
            if (this.isValid()) {
                this._lastSubmitValue = this.getValue();
            }
        }, this));
    },

    getValue: function () {
        return this.element.val() || "";
    },

    isEditing: function () {
        return this._isEditing;
    },

    getLastValidValue: function () {
        return this._lastValidValue;
    },

    setValid: function () {
        BI.Input.superclass.setValid.apply(this, arguments);
        if (this.isValid()) {
            this._lastValidValue = this.getValue();
            this.element.removeClass("bi-input-error");
            this.fireEvent(BI.Input.EVENT_VALID, BI.trim(this.getValue()), this);
        } else {
            if (this._lastValidValue === this.getValue()) {
                this._lastValidValue = null;
            }
            this.element.addClass("bi-input-error");
            this.fireEvent(BI.Input.EVENT_ERROR, BI.trim(this.getValue()), this);
        }
    },

    setEnable: function (b) {
        BI.Input.superclass.setEnable.apply(this, [b]);
        this.element[0].disabled = !b;
    }
});
BI.Input.EVENT_CHANGE = "EVENT_CHANGE";

BI.Input.EVENT_FOCUS = "EVENT_FOCUS";
BI.Input.EVENT_CLICK = "EVENT_CLICK";
BI.Input.EVENT_BLUR = "EVENT_BLUR";
BI.Input.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.Input.EVENT_QUICK_DOWN = "EVENT_QUICK_DOWN";
BI.Input.EVENT_SPACE = "EVENT_SPACE";
BI.Input.EVENT_BACKSPACE = "EVENT_BACKSPACE";

BI.Input.EVENT_START = "EVENT_START";
BI.Input.EVENT_PAUSE = "EVENT_PAUSE";
BI.Input.EVENT_STOP = "EVENT_STOP";
BI.Input.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.Input.EVENT_REMOVE = "EVENT_REMOVE";
BI.Input.EVENT_EMPTY = "EVENT_EMPTY";
BI.Input.EVENT_VALID = "EVENT_VALID";
BI.Input.EVENT_ERROR = "EVENT_ERROR";
BI.Input.EVENT_ENTER = "EVENT_ENTER";
BI.Input.EVENT_RESTRICT = "EVENT_RESTRICT";
$.shortcut("bi.input", BI.Input);