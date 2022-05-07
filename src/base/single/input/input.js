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
            baseCls: (conf.baseCls || "") + " bi-input display-block overflow-dot",
            tagName: "input",
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn, // 按确定键能否退出编辑
            allowBlank: false
        });
    },

    render: function () {
        var self = this;
        var ctrlKey = false;
        var keyCode = null;
        var inputEventValid = false;
        var _keydown = BI.debounce(function (keyCode) {
            self.onKeyDown(keyCode, ctrlKey);
            self._keydown_ = false;
        }, BI.EVENT_RESPONSE_TIME);
        var _clk = BI.debounce(BI.bind(this._click, this), BI.EVENT_RESPONSE_TIME, {
            "leading": true,
            "trailing": false
        });
        this._focusDebounce = BI.debounce(BI.bind(this._focus, this), BI.EVENT_RESPONSE_TIME, {
            "leading": true,
            "trailing": false
        });
        this._blurDebounce = BI.debounce(BI.bind(this._blur, this), BI.EVENT_RESPONSE_TIME, {
            "leading": true,
            "trailing": false
        });
        this.element
            .keydown(function (e) {
                inputEventValid = false;
                ctrlKey = e.ctrlKey || e.metaKey; // mac的cmd支持一下
                keyCode = e.keyCode;
                self.fireEvent(BI.Input.EVENT_QUICK_DOWN, arguments);
            })
            .keyup(function (e) {
                keyCode = null;
                if (!(inputEventValid && e.keyCode === BI.KeyCode.ENTER)) {
                    self._keydown_ = true;
                    _keydown(e.keyCode);
                }
            })
            .on("input propertychange", function (e) {
                // 输入内容全选并直接删光，如果按键没放开就失去焦点不会触发keyup，被focusout覆盖了
                // 其中propertychange在元素属性发生改变的时候就会触发 是为了兼容IE8
                // 通过keyCode判断会漏掉输入法点击输入(右键粘贴暂缓)
                var originalEvent = e.originalEvent;
                if (BI.isNull(originalEvent.propertyName) || originalEvent.propertyName === "value") {
                    inputEventValid = true;
                    self._keydown_ = true;
                    _keydown(keyCode);
                    keyCode = null;
                }
            })
            .click(function (e) {
                e.stopPropagation();
                _clk();
            })
            .mousedown(function (e) {
                self.element.val(self.element.val());
            })
            .focus(function (e) { // 可以不用冒泡
                self._focusDebounce();
            })
            .blur(function (e) {
                //  DEC-14919  IE11在浏览器重新获得焦点之后会先触发focusout再触发focus,要保持先获得焦点再失去焦点的顺序不变,因此采用blur
                self._blurDebounce();
            });
        if (BI.isKey(this.options.value) || BI.isEmptyString(this.options.value)) {
            this.setValue(this.options.value);
        }
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
            BI.delay(blur, BI.EVENT_RESPONSE_TIME);
        } else {
            blur();
        }

        function blur () {
            if (!self.isValid() && self.options.quitChecker.apply(self, [BI.trim(self.getValue())]) !== false) {
                self.element.val(self._lastValidValue ? self._lastValidValue : "");
                self._checkValidationOnValueChange();
                self._defaultState();
            }
            self.element.removeClass("bi-input-focus");
            self._isEditing = false;
            self._start = false;
            if (self.isValid()) {
                var lastValidValue = self._lastValidValue;
                self._lastValidValue = self.getValue();
                self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CONFIRM, self.getValue(), self);
                self.fireEvent(BI.Input.EVENT_CONFIRM);
                if (self._lastValidValue !== lastValidValue) {
                    self.fireEvent(BI.Input.EVENT_CHANGE_CONFIRM);
                }
            }
            self.fireEvent(BI.Input.EVENT_BLUR);
        }
    },

    _click: function () {
        if (this._isEditing !== true) {
            this.selectAll();
            this.fireEvent(BI.Input.EVENT_CLICK);
        }
    },

    onClick: function () {
        this._click();
    },

    onKeyDown: function (keyCode, ctrlKey) {
        if (!this.isValid() || BI.trim(this._lastChangedValue) !== BI.trim(this.getValue())) {
            this._checkValidationOnValueChange();
        }
        if (this.isValid() && BI.trim(this.getValue()) !== "") {
            if (BI.trim(this.getValue()) !== this._lastValue && (!this._start || this._lastValue == null || this._lastValue === "")
                || (this._pause === true && !/(\s|\u00A0)$/.test(this.getValue()))) {
                this._start = true;
                this._pause = false;
                this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STARTEDIT, this.getValue(), this);
                this.fireEvent(BI.Input.EVENT_START);
            }
        }
        if (keyCode == BI.KeyCode.ENTER) {
            if (this.isValid() || this.options.quitChecker.apply(this, [BI.trim(this.getValue())]) !== false) {
                this.blur();
                this.fireEvent(BI.Input.EVENT_ENTER);
            } else {
                this.fireEvent(BI.Input.EVENT_RESTRICT);
            }
        }
        if (keyCode == BI.KeyCode.SPACE) {
            this.fireEvent(BI.Input.EVENT_SPACE);
        }
        if (keyCode == BI.KeyCode.BACKSPACE && this._lastValue == "") {
            this.fireEvent(BI.Input.EVENT_REMOVE);
        }
        if (keyCode == BI.KeyCode.BACKSPACE || keyCode == BI.KeyCode.DELETE) {
            this.fireEvent(BI.Input.EVENT_BACKSPACE);
        }
        this.fireEvent(BI.Input.EVENT_KEY_DOWN, arguments);

        // _valueChange中会更新_lastValue, 这边缓存用以后续STOP事件服务
        var lastValue = this._lastValue;
        if(BI.trim(this.getValue()) !== BI.trim(this._lastValue || "")){
            this._valueChange();
        }
        if (BI.isEndWithBlank(this.getValue())) {
            this._pause = true;
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.PAUSE, "", this);
            this.fireEvent(BI.Input.EVENT_PAUSE);
            this._defaultState();
        } else if ((keyCode === BI.KeyCode.BACKSPACE || keyCode === BI.KeyCode.DELETE) &&
            BI.trim(this.getValue()) === "" && (lastValue !== null && BI.trim(lastValue) !== "")) {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STOPEDIT, this.getValue(), this);
            this.fireEvent(BI.Input.EVENT_STOP);
        }
    },

    // 初始状态
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
            (o.allowBlank === true && BI.trim(v) == "") || (
                BI.isNotEmptyString(BI.trim(v)) && o.validationChecker.apply(this, [BI.trim(v)]) !== false
            )
        );
    },

    focus: function () {
        if (!this.element.is(":visible")) {
            throw new Error("input输入框在不可见下不能focus");
        }
        if (!this._isEditing === true) {
            this.element.focus();
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
                this._lastValidValue = this._lastSubmitValue = this.getValue();
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

    getLastChangedValue: function () {
        return this._lastChangedValue;
    },

    _setValid: function () {
        BI.Input.superclass._setValid.apply(this, arguments);
        if (this.isValid()) {
            this._lastChangedValue = this.getValue();
            this.element.removeClass("bi-input-error");
            this.fireEvent(BI.Input.EVENT_VALID, BI.trim(this.getValue()), this);
        } else {
            if (this._lastChangedValue === this.getValue()) {
                this._lastChangedValue = null;
            }
            this.element.addClass("bi-input-error");
            this.fireEvent(BI.Input.EVENT_ERROR, BI.trim(this.getValue()), this);
        }
    },

    _setEnable: function (b) {
        BI.Input.superclass._setEnable.apply(this, [b]);
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
BI.Input.EVENT_CHANGE_CONFIRM = "EVENT_CHANGE_CONFIRM";
BI.Input.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.Input.EVENT_REMOVE = "EVENT_REMOVE";
BI.Input.EVENT_EMPTY = "EVENT_EMPTY";
BI.Input.EVENT_VALID = "EVENT_VALID";
BI.Input.EVENT_ERROR = "EVENT_ERROR";
BI.Input.EVENT_ENTER = "EVENT_ENTER";
BI.Input.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.shortcut("bi.input", BI.Input);
