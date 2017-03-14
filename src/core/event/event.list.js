/**
 * 统一绑定事件
 * @type {*|void|Object}
 */
BI.EventList = BI.inherit(BI.OB, {
    _defaultConfig: function() {
        return BI.extend(BI.EventList.superclass._defaultConfig.apply(this, arguments), {
            event: "click",
            callback: BI.emptyFn,
            handle: "",
            items:[]
        });
    },

    _init : function() {
        BI.EventList.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _getHandle: function(item){
        var handle = this.options.handle ? _.result(item, this.options.handle) : item;
        return handle.element || handle;
    },

    populate: function(items){
        var self    = this,
            event   = this.options.event,
            callback = this.options.callback;
        BI.nextTick(function(){
            BI.each(items, function(i, item){
                var fn  = callback(item);
                BI.isFunction(fn) && (fn = BI.debounce(fn, BI.EVENT_RESPONSE_TIME, true));
                self._getHandle(item)[event](fn);
            })
        })

    }
});