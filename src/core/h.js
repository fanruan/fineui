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
        type = type.xtype || type;
    }
    if (type === "el") {
        return BI.extend({
            el: children[0]
        }, props);
    }
    if (type === "left") {
        return BI.extend({
            left: children
        }, props);
    }
    if (type === "right") {
        return BI.extend({
            right: children
        }, props);
    }
    if (children.length === 1) {
        if (BI.isKey(children[0])) {
            return BI.extend({
                type: type
            }, { text: children[0] }, props);
        }
        if (BI.isFunction(children[0])) {
            return BI.extend({
                type: type
            }, { items: children[0] }, props);
        }
    }

    return BI.extend({
        type: type
    }, children.length > 0 ? { items: children } : {}, props);
};
