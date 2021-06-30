/**
 * @author windy
 * @version 2.0
 * Created by windy on 2021/6/30
 */
_.extend(BI, {
    switchSystemSize: function(opt) {
        BI.config('bi.constant.system.size', function (ob) {
            return BI.extend(ob, opt);
        });
    },
});

BI.constant('bi.constant.system.size', {
    TOOL_BAR_HEIGHT: 24,
    LIST_ITEM_HEIGHT: 24,
    TRIGGER_HEIGHT: 24,
});

BI.prepares.push(function () {
    BI.SIZE_CONSANTS = BI.Constants.getConstant('bi.constant.widget.size');
});
