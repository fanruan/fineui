/**
 * 一个button选中的时候下面有条线
 *
 * Created by GUY on 2015/9/30.
 * @class BI.LineSegmentButton
 * @extends BI.BasicButton
 */
BI.LineSegmentButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function() {
        var conf = BI.LineSegmentButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend( conf, {
            baseCls : (conf.baseCls ||"")+' bi-line-segment-button bi-list-item-effect',
            once: true,
            readonly: true,
            hgap: 10,
            height: 25
        })
    },

    _init:function() {
        BI.LineSegmentButton.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            text: o.text,
            height: o.height,
            value: o.value,
            hgap: o.hgap
        });

        this.line = BI.createWidget({
            type: "bi.layout",
            cls: "line-segment-button-line",
            height: 3
        })
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.line,
                left: 0,
                right: 0,
                bottom: 0
            }]
        })
    },

    setSelected: function(v){
        BI.LineSegmentButton.superclass.setSelected.apply(this, arguments);
    },

    setText : function(text) {
        BI.LineSegmentButton.superclass.setText.apply(this, arguments);
        this.text.setText(text);
    },

    destroy : function() {
        BI.LineSegmentButton.superclass.destroy.apply(this, arguments);
    }
});
$.shortcut('bi.line_segment_button', BI.LineSegmentButton);