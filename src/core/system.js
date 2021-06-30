/**
 * @author windy
 * @version 2.0
 * Created by windy on 2021/6/30
 */
_.extend(BI, {
    switchSystemParam: function(opt) {
        BI.config('bi.constant.system', function (ob) {
            return BI.deepExtend(ob, opt);
        });
    },
});

// 系统参数常量
BI.constant('bi.constant.system', {
    size: { // 尺寸
        TOOL_BAR_HEIGHT: 24,
        LIST_ITEM_HEIGHT: 24,
        TRIGGER_HEIGHT: 24,
    },
});

BI.prepares.push(function () {
    BI.SIZE_CONSANTS = BI.Constants.getConstant('bi.constant.system').size;
});
