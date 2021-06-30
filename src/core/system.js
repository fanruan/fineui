/**
 * @author windy
 * @version 2.0
 * Created by windy on 2021/6/30
 */
// 系统参数常量
!(function () {
    var system = {
        SIZE: { // 尺寸
            TOOL_BAR_HEIGHT: 24,
            LIST_ITEM_HEIGHT: 24,
            TRIGGER_HEIGHT: 24,
        },
    };

    var provider = function () {
        this.inject = function (type, config) {
            BI.deepExtend(system[type], config);
        };

        this.$get = function () {
            return BI.inherit(BI.OB, {

                getConfig: function (type) {
                    return system[type];
                },
            });
        };
    };

    BI.provider("bi.provider.system", provider);
})();

BI.prepares.push(function () {
    BI.SIZE_CONSANTS = BI.Providers.getProvider('bi.provider.system').getConfig('SIZE');
});

BI.config('bi.provider.system', function (provider) {
    provider.inject('SIZE', {
        TOOL_BAR_HEIGHT: 30,
        LIST_ITEM_HEIGHT: 30,
        TRIGGER_HEIGHT: 30,
    })
});
