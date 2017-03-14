/**
 * guy
 * 标红行为
 * @class BI.RedMarkBehavior
 * @extends BI.Behavior
 */
BI.RedMarkBehavior = BI.inherit(BI.Behavior, {
    _defaultConfig: function() {
        return BI.extend(BI.RedMarkBehavior.superclass._defaultConfig.apply(this, arguments), {

        });
    },

    _init : function() {
        BI.RedMarkBehavior.superclass._init.apply(this, arguments);

    },

    doBehavior: function(items){
        var args  = Array.prototype.slice.call(arguments, 1),
            o     = this.options;
        BI.each(items, function(i, item){
            if(item instanceof BI.Single) {
                if (o.rule(item.getValue(), item)) {
                    item.doRedMark.apply(item, args);
                } else {
                    item.unRedMark.apply(item, args);
                }
            } else {
                item.doBehavior.apply(item, args);
            }
        })
    }
});