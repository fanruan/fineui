BI.Fragment = function () {
};

BI.h = function (type, props, children) {
    if (type === BI.Fragment) {
        return children;
    }
    if (BI.isFunction(type)) {
        type = type.xtype;
    }
    if (type === "el") {
        return BI.extend({
            el: BI.isArray(children) ? children[0] : children
        }, props);
    }
    return BI.extend({
        type: type,
        items: BI.isArray(children) ? children : [children]
    }, props);
};