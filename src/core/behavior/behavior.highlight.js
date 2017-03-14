/**
 * guy
 *
 * @class BI.HighlightBehavior
 * @extends BI.Behavior
 */
BI.HighlightBehavior = BI.inherit(BI.Behavior, {
    _defaultConfig: function() {
        return BI.extend(BI.HighlightBehavior.superclass._defaultConfig.apply(this, arguments), {

        });
    },

    _init : function() {
        BI.HighlightBehavior.superclass._init.apply(this, arguments);

    },

    doBehavior: function(items){
        var args = Array.prototype.slice.call(arguments, 1),
            o = this.options;
        BI.each(items, function(i, item){
            if(item instanceof BI.Single) {
                if (o.rule(item.getValue(), item)) {
                    item.doHighLight.apply(item, args);
                } else {
                    item.unHighLight.apply(item, args);
                }
            } else {
                item.doBehavior.apply(item, args);
            }
        })
    }
});