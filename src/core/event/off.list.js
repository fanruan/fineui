/**
 * Created by GUY on 2015/6/25.
 */
/**
 * 统一监听jquery事件
 * @type {*|void|Object}
 */
BI.OffList = BI.inherit(BI.OB, {
    _defaultConfig: function() {
        return BI.extend(BI.OffList.superclass._defaultConfig.apply(this, arguments), {
            event: "click",
            items:[]
        });
    },

    _init : function() {
        BI.OffList.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _getHandle: function(item){
        var handle = this.options.handle ? _.result(item, this.options.handle) : item;
        return handle.element || handle;
    },

    populate: function(items){
        var self   = this,
            event  = this.options.event;
        BI.each(items, function(i, item){
            self._getHandle(item).off(event);
        })
    }
});