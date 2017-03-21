/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/12/24.
 * @class BI.ProgressBarBar
 * @extends BI.BasicButton
 */
BI.ProgressBarBar = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.ProgressBarBar.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-progress-bar-bar",
            height: 24
        })
    },
    _init: function () {
        BI.ProgressBarBar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.svg = BI.createWidget({
            type: "bi.svg",
            width: 6,
            height: 6
        });
        this.svg.circle(3, 3, 3).attr({fill: "#ffffff", "stroke": ""});
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.svg,
                right: 10,
                top: 9
            }]
        });
        this.processor = BI.createWidget({
            type: "bi.progress_bar_processor",
            width: "0%",
            height: o.height
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.processor]
        });
    },

    setValue: function (process) {
        this.processor.setValue(process);

    }
});
$.shortcut("bi.progress_bar_bar", BI.ProgressBarBar);