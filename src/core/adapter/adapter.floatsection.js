/**
 * @class BI.FloatSection
 * @extends BI.View
 * @abstract
 */
BI.FloatSection = BI.inherit(BI.View, {
    _init : function() {
        BI.FloatSection.superclass._init.apply(this, arguments);
        var self = this;
        var flatten = ["_init", "_defaultConfig", "_vessel", "_render", "getName", "listenEnd", "local", "refresh", "load", "change"];
        flatten = BI.makeObject(flatten, true);
        BI.each(this.constructor.caller.caller.caller.prototype, function (key) {
            if (flatten[key]) {
                return;
            }
            var f = self[key];
            if (BI.isFunction(f)) {
                self[key] = BI.bind(function () {
                    if (this.model._start === true) {
                        this._F.push({f: f, arg: arguments});
                        return;
                    }
                    return f.apply(this, arguments);
                }, self);
            }
        })
    },

    rebuildNorth : function(north) {
        return true;
    },
    rebuildCenter : function(center) {},
    rebuildSouth : function(south) {
        return false;
    },
    close: function(){
        this.notifyParentEnd();
        this.trigger(BI.PopoverSection.EVENT_CLOSE);
    },
    end: function(){

    }
});

/**
 * 弹出层
 * @class BI.PopoverSection
 * @extends BI.Widget
 * @abstract
 */
BI.PopoverSection = BI.inherit(BI.Widget, {
    _init : function() {
        BI.PopoverSection.superclass._init.apply(this, arguments);
    },

    rebuildNorth : function(north) {
        return true;
    },
    rebuildCenter : function(center) {},
    rebuildSouth : function(south) {
        return false;
    },
    close: function(){
        this.fireEvent(BI.PopoverSection.EVENT_CLOSE);
    },
    end: function(){

    }
});
BI.PopoverSection.EVENT_CLOSE = "EVENT_CLOSE";