/**
 * z-index在1亿层级
 * 弹出提示消息框，用于模拟阻塞操作（通过回调函数实现）
 * @class BI.Msg
 */
BI.Msg = function () {

    var messageShow, $mask, $pop;

    return {
        alert: function (title, message, callback) {
            this._show(false, title, message, callback);
        },
        confirm: function (title, message, callback) {
            this._show(true, title, message, callback);
        },
        prompt: function (title, message, value, callback, min_width) {
            // BI.Msg.prompt(title, message, value, callback, min_width);
        },
        toast: function (message, options, context) {
            options = options || {};
            context = context || BI.Widget._renderEngine.createElement("body");
            var level = options.level || "normal";
            var autoClose = BI.isNull(options.autoClose) ? true : options.autoClose;
            var toast = BI.createWidget({
                type: "bi.toast",
                cls: "bi-message-animate bi-message-leave",
                level: level,
                autoClose: autoClose,
                text: message
            });
            BI.createWidget({
                type: "bi.absolute",
                element: context,
                items: [{
                    el: toast,
                    left: "50%",
                    top: 10
                }]
            });
            toast.element.css({"margin-left": -1 * toast.element.outerWidth() / 2});
            toast.element.removeClass("bi-message-leave").addClass("bi-message-enter");

            autoClose && BI.delay(function () {
                toast.element.removeClass("bi-message-enter").addClass("bi-message-leave");
                BI.delay(function () {
                    toast.destroy();
                }, 1000);
            }, 5000);
        },
        _show: function (hasCancel, title, message, callback) {
            var name = BI.UUID();
            BI.Popovers.create(name, {
                type: "bi.bar_popover",
                header: title,
                body: {
                    type: "bi.center_adapt",
                    items: [{
                        type: "bi.label",
                        text: message
                    }]
                },
                footer: hasCancel ? {
                    type: "bi.right_vertical_adapt",
                    lgap: 10,
                    items: [{
                        type: "bi.button",
                        text: BI.i18nText("BI-Basic_Cancel"),
                        level: "ignore",
                        handler: function () {
                            if (BI.isFunction(callback)) {
                                callback.apply(null, [false]);
                            }
                            BI.Popovers.remove(name);
                        }
                    }, {
                        type: "bi.button",
                        text: BI.i18nText("BI-Basic_Sure"),
                        handler: function () {
                            if (BI.isFunction(callback)) {
                                callback.apply(null, [true]);
                            }
                            BI.Popovers.remove(name);
                        }
                    }]
                } : {
                    type: "bi.right_vertical_adapt",
                    lgap: 10,
                    items: [{
                        type: "bi.button",
                        text: BI.i18nText("BI-Basic_Cancel"),
                        level: "ignore",
                        handler: function () {
                            if (BI.isFunction(callback)) {
                                callback.apply(null, [false]);
                            }
                            BI.Popovers.remove(name);
                        }
                    }]
                },
                size: "small"
            }).open(name);
        }
    };
}();