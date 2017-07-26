/**
 * 另一套风格的单选按钮组
 *
 * Created by GUY on 2015/9/30.
 * @class BI.LineSegment
 * @extends BI.Widget
 */
BI.LineSegment = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LineSegment.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-line-segment bi-border-bottom",
            items: [],
            height: 30
        });
    },
    _init: function () {
        BI.LineSegment.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNumber(o.height)) {
            this.element.css({height: o.height - 1, lineHeight: (o.height - 1) + 'px'});
        }
        this.buttonGroup = BI.createWidget({
            element: this,
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.line_segment_button",
                height: o.height - 1
            }),
            layout: [
                {
                    type: "bi.center"
                }
            ]
        });
        this.buttonGroup.on(BI.Controller.EVENT_CHANGE, function(){
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments)
        });
        this.buttonGroup.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.fireEvent(BI.LineSegment.EVENT_CHANGE)
        })
    },

    setValue: function (v) {
        this.buttonGroup.setValue(v);
    },

    setEnabledValue: function (v) {
        this.buttonGroup.setEnabledValue(v);
    },


    getValue: function () {
        return this.buttonGroup.getValue();
    }
});
BI.LineSegment.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.line_segment', BI.LineSegment);