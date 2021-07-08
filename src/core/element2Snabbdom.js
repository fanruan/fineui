!function () {
    var patch = BI.Snabbdom.init([BI.Snabbdom.attributesModule, BI.Snabbdom.classModule, BI.Snabbdom.datasetModule, BI.Snabbdom.propsModule, BI.Snabbdom.styleModule, BI.Snabbdom.eventListenersModule]);
    BI.Element2Snabbdom = function (parentNode) {
        if (parentNode.nodeType === 3) {
            return parentNode.textContent;
        }
        var data = BI.jQuery._data(parentNode);
        var on = {};
        BI.each(data && data.events, function (eventName, events) {
            on[eventName] = function () {
                var ob = this, args = arguments;
                BI.each(events, function (i, ev) {
                    ev.handler.apply(ob, args);
                });
            };
        });
        var style = parentNode.getAttribute("style");
        // var claz = parentNode.getAttribute("class");
        var vnode = BI.Snabbdom.h(parentNode.nodeName, {
            class: BI.makeObject(parentNode.classList),
            props: {
                style: style
            },
            on: on,
            hook: {
                create: function () {
                    BI.each(parentNode._Widget, function (i, w) {
                        w.element = $(vnode.elm);
                    });
                }
            }
        }, BI.map(parentNode.childNodes, function (i, childNode) {
            return BI.Element2Snabbdom(childNode);
        }));
        return vnode;
    };

    BI.patchVNode = function (element, node) {
        patch(element, node);
    };
}();

