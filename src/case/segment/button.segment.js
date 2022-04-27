/**
 * 分段控件使用的button
 *
 * Created by GUY on 2015/9/7.
 * @class BI.SegmentButton
 * @extends BI.BasicButton
 */
BI.SegmentButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.SegmentButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-segment-button bi-list-item-select bi-card",
            shadow: true,
            readonly: true,
            hgap: 5
        });
    },

    _init: function () {
        BI.SegmentButton.superclass._init.apply(this, arguments);
        var opts = this.options, self = this;
        // if (BI.isNumber(opts.height) && BI.isNull(opts.lineHeight)) {
        //    this.element.css({lineHeight : (opts.height - 2) + 'px'});
        // }
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            textHeight: opts.height,
            whiteSpace: opts.whiteSpace,
            text: opts.text,
            value: opts.value,
            hgap: opts.hgap
        });
    },

    setSelected: function () {
        BI.SegmentButton.superclass.setSelected.apply(this, arguments);
    },

    setText: function (text) {
        BI.SegmentButton.superclass.setText.apply(this, arguments);
        this.text.setText(text);
    }
});
BI.shortcut("bi.segment_button", BI.SegmentButton);
