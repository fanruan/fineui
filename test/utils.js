!(function () {
    BI.Test = {};
    _.extend(BI.Test, {
        createWidget: function (widgetJson) {
            var widget = BI.createWidget(BI.extend(widgetJson, {
                root: true
            }));
            widget.element.appendTo("body");
            return widget;
        },

        /**
         * 模拟一次输入框的keydown事件
         */
        triggerKeyDown: function (element, value, keyCode, callback) {
            // keydown
            var e = BI.$.Event("keydown");
            e.keyCode = keyCode;
            element.trigger(e);

            // input
            BI.isNotNull(value) && element.val(value);
            var e1 = BI.$.Event("input");
            e1.originalEvent = {};
            e1.keyCode = keyCode;
            element.trigger(e1);

            // keyup 至少等300ms后触发
            var e2 = BI.$.Event("keyup");
            e2.keyCode = keyCode;
            element.trigger(e2);
            BI.delay(function () {
                callback();
            }, 300);
        },

        /**
         * 模拟一次鼠标hover
         */
        triggerMouseover: function (element, callback) {
            // keydown
            var e = BI.$.Event("mouseover");
            element.trigger(e);
            callback && callback();
        }
    })
})();