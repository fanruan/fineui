BI.Fragment = function () {
};

BI.h = function (type, props, children) {
    if (children != null) {
        if (!BI.isArray(children)) {
            children = [children];
        }
    } else {
        children = [];
    }
    if (arguments.length > 3) {
        for (var i = 3; i < arguments.length; i++) {
            if (BI.isArray(arguments[i])) {
                children = children.concat(arguments[i]);
            } else {
                children.push(arguments[i]);
            }
        }
    }
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
        type: type,
    }, children.length > 0 ? {items: children} : {}, props);
};