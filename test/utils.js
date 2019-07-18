!(function () {
    BI.Test = {};
    _.extend(BI.Test, {
        createWidget: function (widgetJson) {
            var widget = BI.createWidget(widgetJson);
            widget._isRoot = true;
            widget._mount();
            widget.element.appendTo("body");
            return widget;
        }
    })
})();