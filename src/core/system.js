/**
 * @author windy
 * @version 2.0
 * Created by windy on 2021/6/30
 */
// 系统参数常量
!(function () {
    var system = {
        size: { // 尺寸
            TOOL_BAR_HEIGHT: 24,
            LIST_ITEM_HEIGHT: 24,
            TRIGGER_HEIGHT: 24,
        },
    };

    var provider = function () {

        this.SYSTEM = system;

        this.setSize = function (opt) {
            BI.deepExtend(system, { size: opt });
        };

        this.$get = function () {
            return BI.inherit(BI.OB, {

                getSize: function () {
                    return system.size;
                },
            });
        };
    };

    BI.provider("bi.provider.system", provider);
})();

BI.prepares.push(function () {
    BI.SIZE_CONSANTS = BI.Providers.getProvider('bi.provider.system').getSize();
});
