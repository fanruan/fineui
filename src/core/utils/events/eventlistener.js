BI.EventListener = {
    listen: function listen(target, eventType, callback) {
        if (target.addEventListener) {
            target.addEventListener(eventType, callback, false);
            return {
                remove: function remove() {
                    target.removeEventListener(eventType, callback, false);
                }
            };
        } else if (target.attachEvent) {
            target.attachEvent('on' + eventType, callback);
            return {
                remove: function remove() {
                    target.detachEvent('on' + eventType, callback);
                }
            };
        }
    },

    capture: function capture(target, eventType, callback) {
        if (target.addEventListener) {
            target.addEventListener(eventType, callback, true);
            return {
                remove: function remove() {
                    target.removeEventListener(eventType, callback, true);
                }
            };
        } else {
            return {
                remove: BI.emptyFn
            };
        }
    },

    registerDefault: function registerDefault() {
    }
};