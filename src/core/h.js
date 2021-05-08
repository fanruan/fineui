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
            el: children[0]
        }, props);
    }
    return BI.extend({
        items: children
    }, props);
};