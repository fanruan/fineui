/**
 * 组件请求数据超时提示
 * Created by Young's on 2017/2/4.
 */
BI.TimeoutToast = BI.inherit(BI.Tip, {
    _defaultConfig: function () {
        return BI.extend(BI.TimeoutToast.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-timeout-toast"
        });
    },

    _init: function () {
        BI.TimeoutToast.superclass._init.apply(this, arguments);
        var self = this;
        this.requests = [];
        this.toast = BI.createWidget({
            type: "bi.vertical_adapt",
            element: this,
            items: [{
                type: "bi.label",
                text: BI.i18nText("BI-Request_Time_Out_Toast_Tip")
            }, {
                type: "bi.text_button",
                cls: "cancel-button",
                width: 60,
                height: 22,
                text: BI.i18nText("BI-Basic_Cancel"),
                title: BI.i18nText("BI-Basic_Cancel"),
                handler: function () {
                    self.cancelAllRequests();
                }
            }, {
                type: "bi.text_button",
                cls: "retry-button",
                width: 60,
                height: 22,
                text: BI.i18nText("BI-Basic_Retry"),
                title: BI.i18nText("BI-Basic_Retry"),
                handler: function () {
                    self.toast.element.slideUp(500);
                    self._retryAll();
                }
            }, {
                type: "bi.icon_button",
                cls: "close-font",
                width: 20,
                height: 20,
                title: BI.i18nText("BI-Basic_Close"),
                handler: function () {
                    self.toast.element.slideUp(500);
                }
            }],
            width: 520,
            height: 30,
            hgap: 2
        });

        BI.createWidget({
            type: "bi.absolute",
            element: $("body"),
            items: [{
                el: this.toast,
                left: "50%",
                top: 0
            }]
        });
        this.toast.element.css({"margin-left": -1 * this.toast.element.outerWidth() / 2});
        this.toast.setVisible(false);
    },

    _retryAll: function () {
        var self = this;
        var clonedRequests = BI.deepClone(this.requests);
        this.requests = [];
        BI.each(clonedRequests, function (i, options) {
            BI.isFunction(self.callback) && self.callback(options);
        });
    },

    cancelAllRequests: function () {
        this.toast.element.slideUp(500);
        BI.each(this.requests, function (i, reqArgs) {
            if (BI.isNotNull(reqArgs) && BI.isFunction(reqArgs.complete)) {
                reqArgs.complete();
            }
        });
        this.requests = [];
    },

    setCallback: function (callback) {
        this.callback = callback;
    },

    addReq: function (options) {
        var self = this;
        if (this.requests.length === 0) {
            setTimeout(function () {
                if (self.requests.contains(options)) {
                    self.toast.element.slideDown(500);
                }
            }, 5 * 60 * 1000);  //5 min
        }
        this.requests.push(options);
    },

    removeReq: function (options) {
        BI.remove(this.requests, options);
        if (this.requests.length === 0) {
            this.toast.element.slideUp(500);
        }
    },

    hasReq: function (options) {
        return this.requests.contains(options);
    }
});
$.shortcut("bi.timeout_toast", BI.TimeoutToast);