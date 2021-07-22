/**
 * guy
 * 标红行为
 * @class BI.RedMarkBehavior
 * @extends BI.Behavior
 */
BI.RedMarkBehavior = BI.inherit(BI.Behavior, {
    doBehavior: function (items) {
        var args  = Array.prototype.slice.call(arguments, 1),
            o     = this.options;
        BI.each(items, function (i, item) {
            if(item instanceof BI.Single) {
                if (o.rule(item.getValue(), item)) {
                    item.doRedMark && item.doRedMark.apply(item, args);
                } else {
                    item.doRedMark && item.unRedMark.apply(item, args);
                }
            } else {
                item.doBehavior && item.doBehavior.apply(item, args);
            }
        });
    }
});
