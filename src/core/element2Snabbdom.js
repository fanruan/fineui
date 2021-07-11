!function () {
    var patch = BI.Snabbdom.init([BI.Snabbdom.attributesModule, BI.Snabbdom.classModule, BI.Snabbdom.datasetModule, BI.Snabbdom.propsModule, BI.Snabbdom.styleModule, BI.Snabbdom.eventListenersModule]);
    BI.Element2Vnode = function (parentNode) {
        if (parentNode.nodeType === 3) {
            return BI.Snabbdom.vnode(undefined, undefined, undefined, parentNode.textContent, parentNode);
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
        var attrs = {};
        var elmAttrs = parentNode.attributes;
        var elmChildren = parentNode.childNodes;
        var key = parentNode.getAttribute("key");
        for (i = 0, n = elmAttrs.length; i < n; i++) {
            var name = elmAttrs[i].nodeName;
            if (name !== "id" && name !== "class") {
                attrs[name] = elmAttrs[i].nodeValue;
            }
        }
        var vnode = BI.Snabbdom.vnode(parentNode.nodeName, {
            class: BI.makeObject(parentNode.classList),
            attrs: attrs,
            key: key,
            on: on,
            hook: {
                create: function () {
                    BI.each(BI.Widget._renderEngine.createElement(parentNode).data("_Widgets"), function (i, w) {
                        w.element = BI.Widget._renderEngine.createElement(vnode.elm);
                    });
                }
            }
        }, BI.map(elmChildren, function (i, childNode) {
            return BI.Element2Vnode(childNode);
        }), undefined, parentNode);
        return vnode;
    };

    BI.patchVNode = function (element, node) {
        patch(element, node);
    };
}();

