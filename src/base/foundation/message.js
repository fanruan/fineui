/**
 * z-index在1亿层级
 * 弹出提示消息框，用于模拟阻塞操作（通过回调函数实现）
 * @class BI.Msg
 */
BI.Msg = function () {

    var $mask, $pop;

    var messageShows = [];

    var toastStack = [];

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
            var level = options.level || "common";
            var autoClose = BI.isNull(options.autoClose) ? true : options.autoClose;
            var callback = BI.isFunction(options.callback) ? options.callback : BI.emptyFn;
            var toast = BI.createWidget({
                type: "bi.toast",
                cls: "bi-message-animate bi-message-leave",
                level: level,
                autoClose: autoClose,
                closable: options.closable,
                text: message,
                listeners: [{
                    eventName: BI.Toast.EVENT_DESTORY,
                    action: function () {
                        BI.remove(toastStack, toast.element);
                        var _height = BI.SIZE_CONSANTS.TOAST_TOP;
                        BI.each(toastStack, function (i, element) {
                            element.css({"top": _height});
                            _height += element.outerHeight() + 10;
                        });
                        callback();
                    }
                }]
            });
            var height = BI.SIZE_CONSANTS.TOAST_TOP;
            BI.each(toastStack, function (i, element) {
                height += element.outerHeight() + 10;
            });
            BI.createWidget({
                type: "bi.absolute",
                element: context,
                items: [{
                    el: toast,
                    left: "50%",
                    top: height
                }]
            });
            toastStack.push(toast.element);
            toast.element.css({"margin-left": -1 * toast.element.outerWidth() / 2});
            toast.element.removeClass("bi-message-leave").addClass("bi-message-enter");

            autoClose && BI.delay(function () {
                toast.element.removeClass("bi-message-enter").addClass("bi-message-leave");
                toast.destroy();
            }, 5000);
            return function () {
                toast.element.removeClass("bi-message-enter").addClass("bi-message-leave");
                toast.destroy();
            };
        },
        _show: function (hasCancel, title, message, callback) {
            BI.isNull($mask) && ($mask = BI.Widget._renderEngine.createElement("<div class=\"bi-z-index-mask\">").css({
                position: "absolute",
                zIndex: BI.zIndex_tip - 2,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.5
            }).appendTo("body"));
            $pop = BI.Widget._renderEngine.createElement("<div class=\"bi-message-depend\">").css({
                position: "absolute",
                zIndex: BI.zIndex_tip - 1,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }).appendTo("body");
            var close = function () {
                messageShows[messageShows.length - 1].destroy();
                messageShows.pop();
                if (messageShows.length === 0) {
                    $mask.remove();
                    $mask = null;
                }
            };
            var controlItems = [];
            if (hasCancel === true) {
                controlItems.push({
                    el: {
                        type: "bi.button",
                        text: BI.i18nText("BI-Basic_Cancel"),
                        level: "ignore",
                        handler: function () {
                            close();
                            if (BI.isFunction(callback)) {
                                callback.apply(null, [false]);
                            }
                        }
                    }
                });
            }
            controlItems.push({
                el: {
                    type: "bi.button",
                    text: BI.i18nText("BI-Basic_OK"),
                    handler: function () {
                        close();
                        if (BI.isFunction(callback)) {
                            callback.apply(null, [true]);
                        }
                    }
                }
            });
            var conf = {
                element: $pop,
                type: "bi.center_adapt",
                items: [
                    {
                        type: "bi.border",
                        attributes: {
                            tabIndex: 1
                        },
                        mounted: function () {
                            this.element.keyup(function (e) {
                                if (e.keyCode === BI.KeyCode.ENTER) {
                                    close();
                                    if (BI.isFunction(callback)) {
                                        callback.apply(null, [true]);
                                    }
                                } else if (e.keyCode === BI.KeyCode.ESCAPE) {
                                    close();
                                    if (hasCancel === true) {
                                        if (BI.isFunction(callback)) {
                                            callback.apply(null, [false]);
                                        }
                                    }
                                }
                            });
                            try {
                                this.element.focus();
                            } catch (e) {

                            }
                        },
                        cls: "bi-card",
                        items: {
                            north: {
                                el: {
                                    type: "bi.border",
                                    cls: "bi-message-title bi-background",
                                    items: {
                                        center: {
                                            el: {
                                                type: "bi.label",
                                                cls: "bi-font-bold",
                                                text: title || BI.i18nText("BI-Basic_Prompt"),
                                                textAlign: "left",
                                                hgap: 20,
                                                height: 40
                                            }
                                        },
                                        east: {
                                            el: {
                                                type: "bi.icon_button",
                                                cls: "bi-message-close close-font",
                                                //                                                    height: 50,
                                                handler: function () {
                                                    close();
                                                    if (BI.isFunction(callback)) {
                                                        callback.apply(null, [false]);
                                                    }
                                                }
                                            },
                                            width: 56
                                        }
                                    }
                                },
                                height: 40
                            },
                            center: {
                                el: BI.isPlainObject(message) ? message : {
                                    type: "bi.label",
                                    vgap: 10,
                                    hgap: 20,
                                    whiteSpace: "normal",
                                    text: message
                                }
                            },
                            south: {
                                el: {
                                    type: "bi.absolute",
                                    items: [{
                                        el: {
                                            type: "bi.right_vertical_adapt",
                                            lgap: 10,
                                            items: controlItems
                                        },
                                        top: 0,
                                        left: 20,
                                        right: 20,
                                        bottom: 0
                                    }]

                                },
                                height: 44
                            }
                        },
                        width: 450,
                        height: 200
                    }
                ]
            };

            messageShows[messageShows.length] = BI.createWidget(conf);
        }
    };
}();
