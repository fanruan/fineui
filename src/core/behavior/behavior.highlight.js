/**
 * guy
 *
 * @class BI.HighlightBehavior
 * @extends BI.Behavior
 */
BI.HighlightBehavior = BI.inherit(BI.Behavior, {
    doBehavior: function (items) {
        var args = Array.prototype.slice.call(arguments, 1),
            o = this.options;
        BI.each(items, function (i, item) {
            if (item instanceof BI.Single) {
                var rule = o.rule(item.getValue(), item);

                function doBe (run) {
                    if (run === true) {
                        item.doHighLight && item.doHighLight.apply(item, args);
                    } else {
                        item.unHighLight && item.unHighLight.apply(item, args);
                    }
                }

                if (BI.isFunction(rule)) {
                    rule(doBe);
                } else {
                    doBe(rule);
                }
            } else {
                item.doBehavior && item.doBehavior.apply(item, args);
            }
        });
    }
});
