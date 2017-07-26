/**
 * Created by Dailer on 2017/7/26.
 */

Demo.ProgressBar = BI.inherit(BI.Widget, {

    render: function () {
        var self = this;
        var progress = BI.createWidget({
            type: "bi.progress_bar",
            width: 300
        });

        //控件背景用的 是 bi-background ,和页面背景重复了,无奈窝只能这样搞一下了,虽然很怪异
        progress.bar.element.css({
            backgroundColor: "#A9A9A9"
        });

        var numbereditor = BI.createWidget({
            type: "bi.fine_tuning_number_editor",
            height: 30
        });
        numbereditor.on(BI.FineTuningNumberEditor.EVENT_CONFIRM, function () {
            progress.setValue(numbereditor.getValue());
        })

        BI.createWidget({
            type: "bi.center_adapt",
            element: this,
            items: [progress]
        });

        return {
            type: "bi.absolute",
            items: [{
                el: numbereditor,
                left: 300,
                right: 300,
                bottom: 60
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "setValue(100)",
                    handler: function () {
                        progress.setValue(100);
                    }
                },
                left: 0,
                right: 0,
                bottom: 30
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "setValue(75)",
                    handler: function () {
                        progress.setValue(75);
                    }
                },
                left: 0,
                right: 0,
                bottom: 0
            }]
        }
    }
});

BI.shortcut("demo.progress_bar", Demo.ProgressBar);