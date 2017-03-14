/**
 * guy
 * 气泡提示
 * @class BI.Bubble
 * @extends BI.Tip
 * @type {*|void|Object}
 */
BI.Bubble = BI.inherit(BI.Tip, {
    _defaultConfig: function() {
        return BI.extend(BI.Bubble.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-bubble",
            direction: "top",
            text: "",
            height: 35
        })
    },
    _init : function() {
        BI.Bubble.superclass._init.apply(this, arguments);
        var fn = function (e) {
            e.stopPropagation();
            e.stopEvent();
            return false;
        };
        this.element.bind({"click": fn, "mousedown": fn, "mouseup": fn, "mouseover": fn, "mouseenter": fn, "mouseleave": fn, "mousemove": fn});
        BI.createWidget({
            type: "bi.left",
            element: this.element,
            items: [this["_" + this.options.direction]()]
        })
    },

    _createBubbleText: function(){
        return (this.text = BI.createWidget({
            type: "bi.label",
            cls: "bubble-text",
            text: this.options.text,
            hgap: 10,
            height: 30
        }));
    },

    _top: function(){
        return BI.createWidget({
            type: "bi.vertical",
            items: [{
                el: this._createBubbleText(),
                height: 30
            }, {
                el: {
                    type: "bi.layout"
                },
                height: 3
            }]
        })
    },

    _bottom: function(){
        return BI.createWidget({
            type: "bi.vertical",
            items: [{
                el: {
                    type: "bi.layout"
                },
                height: 3
            }, {
                el: this._createBubbleText(),
                height: 30
            }]
        })
    },

    _left: function(){
        return BI.createWidget({
            type: "bi.right",
            items: [{
                el: {
                    type: "bi.layout",
                    width: 3,
                    height: 30
                }
            }, {
                el: this._createBubbleText()
            }]
        })
    },

    _right: function(){
        return BI.createWidget({
            type: "bi.inline",
            items: [{
                el: {
                    type: "bi.layout",
                    width: 3,
                    height: 30
                }
            }, {
                el: this._createBubbleText()
            }]
        })
    },

    setText: function(text){
        this.text.setText(text);
    }
});

$.shortcut("bi.bubble", BI.Bubble);