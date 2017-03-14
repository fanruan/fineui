/**
 * z-index在1亿层级
 * 弹出提示消息框，用于模拟阻塞操作（通过回调函数实现）
 * @class BI.Msg
 */
$.extend(BI, {
    Msg: function () {

        var messageShow, $mask, $pop;

        return {
            toast: function (message, level, context) {
                context = context || $("body");
                var toast = BI.createWidget({
                    type: "bi.toast",
                    level: level,
                    text: message
                });
                BI.createWidget({
                    type: "bi.absolute",
                    element: context,
                    items: [{
                        el: toast,
                        left: "50%",
                        top: 0
                    }]
                });
                if (toast.element.outerWidth() > context.outerWidth()) {
                    toast.setWidth(context.width());
                }
                toast.element.css({"margin-left": -1 * toast.element.outerWidth() / 2});
                toast.invisible();
                toast.element.slideDown(500, function () {
                    BI.delay(function () {
                        toast.element.slideUp(500, function () {
                            toast.destroy();
                        })
                    }, 5000)
                })
            },
            _show: function (hasCancel, title, message, callback) {
                $mask = $('<div class="bi-message-mask">').css({
                    position: 'absolute',
                    'zIndex': 99999998,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1
                }).appendTo('body');
                $pop = $('<div class="bi-message-depend">').css({
                    position: 'absolute',
                    'zIndex': 99999999,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }).appendTo('body');
                var close = function () {
                    messageShow.destroy();
                    $mask.remove();
                };
                var controlItems = [];
                if (hasCancel === true) {
                    controlItems.push({
                        el: {
                            type: 'bi.button',
                            text: BI.i18nText("BI-Cancel"),
                            height: 30,
                            level: 'ignore',
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
                        type: 'bi.button',
                        text: BI.i18nText("BI-OK"),
                        height: 30,
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
                    type: 'bi.center_adapt',
                    items: [
                        {
                            type: 'bi.border',
                            cls: 'bi-message-content',
                            items: {
                                'north': {
                                    el: {
                                        type: 'bi.border',
                                        cls: 'bi-message-title',
                                        items: {
                                            center: {
                                                el: {
                                                    type: 'bi.label',
                                                    text: title || BI.i18nText("BI-Prompt"),
                                                    textAlign: 'left',
                                                    hgap: 20,
                                                    height: 50
                                                }
                                            },
                                            east: {
                                                el: {
                                                    type: 'bi.icon_button',
                                                    cls: 'bi-message-close close-font',
//                                                    height: 50,
                                                    handler: function () {
                                                        close();
                                                    }
                                                },
                                                width: 60
                                            }
                                        }
                                    },
                                    height: 50
                                },
                                'center': {
                                    el: {
                                        type: "bi.text",
                                        cls: "bi-message-text",
                                        tgap: 60,
                                        hgap: 20,
                                        lineHeight: 30,
                                        whiteSpace: "normal",
                                        text: message
                                    }
                                },
                                'south': {
                                    el: {
                                        type: "bi.absolute",
                                        items: [{
                                            el: {
                                                type: 'bi.right_vertical_adapt',
                                                hgap: 5,
                                                items: controlItems
                                            },
                                            top: 0,
                                            left: 20,
                                            right: 20,
                                            bottom: 0
                                        }]

                                    },
                                    height: 60
                                }
                            },
                            width: 400,
                            height: 300
                        }
                    ]
                };

                messageShow = BI.createWidget(conf);
            }
        };
    }()
});