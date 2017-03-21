/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/12/24.
 * @class BI.ProgressBar
 * @extends BI.BasicButton
 */
BI.ProgressBar = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.ProgressBar.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-progress-bar",
            height: 24
        })
    },
    _init: function () {
        BI.ProgressBar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.bar = BI.createWidget({
            type: "bi.progress_bar_bar",
            height: o.height
        });
        this.label = BI.createWidget({
            type: "bi.label",
            cls: "progress-bar-label",
            width: 50,
            height: o.height,
            value: "0%"
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.bar
            }, {
                el: this.label,
                width: 50
            }]
        })
    },

    setValue: function (process) {
        if (process >= 100) {
            process = 100;
            this.label.element.addClass("success");
        } else {
            this.label.element.removeClass("success");
        }
        this.label.setValue(process + "%");
        this.bar.setValue(process);
    }
});
$.shortcut("bi.progress_bar", BI.ProgressBar);