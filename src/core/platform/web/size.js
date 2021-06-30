/**
 * @author windy
 * @version 2.0
 * Created by windy on 2021/6/30
 */
_.extend(BI, {
    VIEW_SIZE: {
        SMALL: 1,
        NORMAL: 2,
        BIG: 3,
        CUSTOM: 4,
    },
});
BI.Func = BI.Func || {};
_.extend(BI.Func, {

    /**
     * 默认提供三种尺寸类型，small, normal, big
     * 也可以在此基础上适用类型custom定制尺寸
     * @param opt
     */
    switchWidgetSizeConfig: function(opt) {
        switch (opt.type) {
            case BI.VIEW_SIZE.BIG:
                opt.TOOL_BAR_HEIGHT = 30;
                opt.LIST_ITEM_HEIGHT = 30;
                opt.TRIGGER_HEIGHT = 30;
                break;
            case BI.VIEW_SIZE.SMALL:
            case BI.VIEW_SIZE.NORMAL:
            default:
                break;
        }

        BI.config('bi.constant.widget.size', function (ob) {
            return BI.extend(ob, opt);
        });
    },
});

BI.constant('bi.constant.widget.size', {
    TOOL_BAR_HEIGHT: 24,
    LIST_ITEM_HEIGHT: 24,
    TRIGGER_HEIGHT: 24,
});

BI.prepares.push(function () {
    BI.SIZE_CONSANTS = BI.Constants.getConstant('bi.constant.widget.size');
});
