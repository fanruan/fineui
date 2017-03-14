/**
 * guy
 * 可以点击的一行文字
 * @class BI.TextButton
 * @extends BI.BasicButton
 * 文字button
 */
BI.TextButton = BI.inherit(BI.BasicButton, {
    _defaultConfig: function() {
        var conf = BI.TextButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend( conf, {
            tagName: "a",
            baseCls: (conf.baseCls || "") + " bi-text-button display-block",
            textAlign: "center",
            whiteSpace: "nowrap",
            forceCenter: false,
            textWidth: null,
            textHeight: null,
            hgap: 0,
            lgap: 0,
            rgap: 0,
            text:"",
            py: ""
        })
    },

    _init:function() {
        BI.TextButton.superclass._init.apply(this, arguments);
        var o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this.element,
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            textWidth: o.textWidth,
            textHeight: o.textHeight,
            forceCenter: o.forceCenter,
            width: o.width,
            height: o.height,
            hgap: o.hgap,
            lgap: o.lgap,
            rgap: o.rgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
    },

    doClick: function(){
        BI.TextButton.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.TextButton.EVENT_CHANGE, this.getValue(), this);
        }
    },

    doRedMark: function(){
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function(){
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    setText: function(text){
        BI.TextButton.superclass.setText.apply(this, arguments);
        text = BI.isArray(text) ? text.join(",") : text;
        this.text.setText(text);
    },

    setValue: function(text){
        BI.TextButton.superclass.setValue.apply(this, arguments);
        if(!this.isReadOnly()) {
            text = BI.isArray(text) ? text.join(",") : text;
            this.text.setValue(text);
        }
    }
});
BI.TextButton.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.text_button", BI.TextButton);