/**
 * guy
 * 记录内容的输入框
 * @class BI.RecordEditor
 * @extends BI.Single
 */
BI.RecordEditor = BI.inherit(BI.Single, {
    _defaultConfig: function() {
        var conf = BI.RecordEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf , {
            baseCls: (conf.baseCls || "") + " bi-record-editor",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: true,
            watermark: "",
            errorText: "",
            height: 30
        })
    },

    _init : function() {
        BI.RecordEditor.superclass._init.apply(this, arguments);
        this.contents = [];
        var self = this, o = this.options;

        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            mouseOut: o.mouseOut,
            allowBlank : o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.textContainer = BI.createWidget({
            type: "bi.vertical_adapt",
            hgap: 2,
            height: o.height
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_FOCUS, function(){
            self._checkInputState();
            self.fireEvent(BI.RecordEditor.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function(){
            self._checkInputState();
            self.fireEvent(BI.RecordEditor.EVENT_BLUR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function(){
            self.fireEvent(BI.RecordEditor.EVENT_CLICK, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function(){
            self.fireEvent(BI.RecordEditor.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function(v){
            self.fireEvent(BI.RecordEditor.EVENT_KEY_DOWN, arguments);
        });

        this.editor.on(BI.Editor.EVENT_VALID, function(){
            self.fireEvent(BI.RecordEditor.EVENT_VALID, arguments);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function(){
            self.fireEvent(BI.RecordEditor.EVENT_SPACE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function(){
            self.setValue(self.getValue());
            self.editor.isValid() && self.editor.setValue("");
            self.fireEvent(BI.RecordEditor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_START, function(){
            self.fireEvent(BI.RecordEditor.EVENT_START, arguments);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function(){
            self.fireEvent(BI.RecordEditor.EVENT_PAUSE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function(){
            self.fireEvent(BI.RecordEditor.EVENT_STOP, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.RecordEditor.EVENT_ENTER, arguments);
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function(){
            self._checkInputState();
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function(){
            if(!BI.isEmpty(self.contents)){
                self.contents.pop().destroy();
                self.setValue(self.getValue());
                self._adjustInputWidth();
            }
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function(){
            self.fireEvent(BI.RecordEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function(){
            self.fireEvent(BI.RecordEditor.EVENT_RESTRICT, arguments);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function(){
            self.fireEvent(BI.RecordEditor.EVENT_EMPTY, arguments);
        });
        BI.createWidget({
            type: "bi.inline",
            element: this.element,
            items: [this.textContainer, this.editor]
        });
        BI.Resizers.add(this.getName(), BI.bind(this._adjustInputWidth, this));
        this._adjustInputWidth();
    },

    _adjustInputWidth: function(){
        BI.nextTick(BI.bind(function(){
            this.editor.element.css("width", this.element.width() - this.textContainer.element.outerWidth() - 10);
        }, this));
    },

    _checkInputState: function(){
        if(BI.isEmpty(this.contents)){
            this.editor.enableWarterMark();
        } else {
            this.editor.disableWarterMark();
        }
    },

    focus: function(){
        this.editor.focus();
    },

    blur: function(){
        this.editor.blur();
    },

    isValid : function() {
        return this.editor.isValid();
    },

    setErrorText: function(text){
        this.editor.setErrorText(text);
    },

    getErrorText: function(){
        return this.editor.getErrorText();
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    setValue: function (k) {
        this.editor.setValue(k);
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function(){
        var values = BI.map(this.contents, function(i, lb){
            return lb.getText();
        });
        if(BI.isNotEmptyString(this.editor.getValue())){
            return values.concat([this.editor.getValue()]);
        }
        return values;
    },

    setState: function(v){
        BI.StateEditor.superclass.setValue.apply(this, arguments);
        v =  BI.isArray(v) ? v : (v == "" ? [] : [v]);
        var contents = this.contents = [];
        BI.each(v, function(i, lb){
            contents.push(BI.createWidget({
                type: "bi.label",
                height: 25,
                cls: "record-editor-text",
                text: lb
            }))
        });
        this.textContainer.empty();
        this.textContainer.populate(contents);
        this.editor.isValid() && this.editor.setValue("");
        this._checkInputState();
        this._adjustInputWidth();
    },

    destroy: function(){
        BI.Resizers.remove(this.getName());
        BI.RecordEditor.superclass.destroy.apply(this, arguments);
    }
});
BI.RecordEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.RecordEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.RecordEditor.EVENT_BLUR = "EVENT_BLUR";
BI.RecordEditor.EVENT_CLICK = "EVENT_CLICK";
BI.RecordEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";

BI.RecordEditor.EVENT_START = "EVENT_START";
BI.RecordEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.RecordEditor.EVENT_STOP = "EVENT_STOP";
BI.RecordEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.RecordEditor.EVENT_VALID = "EVENT_VALID";
BI.RecordEditor.EVENT_ERROR = "EVENT_ERROR";
BI.RecordEditor.EVENT_ENTER = "EVENT_ENTER";
BI.RecordEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.RecordEditor.EVENT_SPACE = "EVENT_SPACE";
BI.RecordEditor.EVENT_EMPTY = "EVENT_EMPTY";

$.shortcut("bi.record_editor", BI.RecordEditor);