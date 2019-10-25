
if (!Object.keys) {
    Object.keys = function(o) {
        if (o !== Object(o)) {
            throw new TypeError('Object.keys called on a non-object');
        }
        // fix的问题
        var falsy;
        var skipArray = {
            __ob__: falsy,
            $accessors: falsy,
            $vbthis: falsy,
            $vbsetter: falsy
        };
        var k = [], p;
        for (p in o) {
            if (!(p in skipArray)) {
                if (Object.prototype.hasOwnProperty.call(o, p)) {
                    k.push(p);
                }
            }
        }
        return k;
    };
}

if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

// https://stackoverflow.com/questions/10919915/ie8-getprototypeof-method
if (typeof Object.getPrototypeOf !== "function") {
    Object.getPrototypeOf = "".__proto__ === String.prototype
        ? function (object) {
            return object.__proto__;
        }
        : function (object) {
            // May break if the constructor has been tampered with
            return object.constructor.prototype;
        };
}

if(!Date.now) {
    Date.now = function () {
        return new Date().valueOf();
    };
}