!(function () {
    BI.Test = {};
    _.extend(BI.Test, {
        createWidget: function (widgetJson) {
            var widget = BI.createWidget(BI.extend(widgetJson, {
                root: true
            }));
            // widget._mount();
            widget.element.appendTo("body");
            return widget;
        }
    })
})();