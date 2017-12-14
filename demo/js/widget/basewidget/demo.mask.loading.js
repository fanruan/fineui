/**
 * Created by Dailer on 2017/7/25.
 */

Demo.LoadingMask = BI.inherit(BI.Widget, {

    render: function () {
        var vessel = this;
        var self = this;
        var left = BI.createWidget({
            type: "bi.center_adapt",
            items: [{
                type: "bi.button",
                text: "LoadingMask",
                height: 30,
                handler: function () {
                    var mask = BI.createWidget({
                        type: "bi.loading_mask",
                        masker: vessel,
                        text: "加载中...3s后结束"
                    });
                    setTimeout(function () {
                        mask.destroy();
                    }, 3000);
                }
            }]
        });
        var right = BI.createWidget({
            type: "bi.center_adapt",
            items: [{
                type: "bi.button",
                text: "CancelLoadingMask",
                height: 30,
                handler: function () {
                    var mask = BI.createWidget({
                        type: "bi.loading_cancel_mask",
                        masker: vessel,
                        text: "正在加载数据"
                    });
                    mask.on(BI.LoadingCancelMask.EVENT_VALUE_CANCEL, function () {
                        mask.destroy();
                        BI.Msg.toast("取消加载了...");
                    });
                }
            }]
        });
        BI.createWidget({
            type: "bi.center_adapt",
            element: vessel,
            items: [left, right],
            hgap: 20
        });
    }
});

BI.shortcut("demo.loading_mask", Demo.LoadingMask);