/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/12/24.
 * @class BI.ProgressBarProcessor
 * @extends BI.BasicButton
 */
BI.ProgressBarProcessor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.ProgressBarProcessor.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-progress-bar-processor",
            height: 24
        })
    },
    _init: function () {
        BI.ProgressBarProcessor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.svg = BI.createWidget({
            type: "bi.svg",
            width: 12,
            height: 12
        });
        this.svg.circle(6, 6, 6).attr({fill: "#eaeaea", "stroke": ""});

        this.dot = this.svg.circle(6, 6, 3).attr({fill: "#ffffff", "stroke": ""}).hide();
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.svg,
                right: 7,
                top: 6
            }]
        });
    },

    setValue: function (process) {
        if (process >= 100) {
            process = 100;
            this.dot.show();
            this.element.addClass("success");
        } else {
            this.dot.hide();
            this.element.removeClass("success");
        }
        this.element.width(process + "%");
    }
});
BI.ProgressBarProcessor.EVENT_CHANGE = "ProgressBarProcessor.EVENT_CHANGE";
$.shortcut("bi.progress_bar_processor", BI.ProgressBarProcessor);