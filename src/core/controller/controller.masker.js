/**
 * 遮罩面板, z-index在1亿层级
 *
 * Created by GUY on 2015/6/24.
 * @class
 */
BI.MaskersController = BI.inherit(BI.LayerController, {
    _defaultConfig: function () {
        return BI.extend(BI.MaskersController.superclass._defaultConfig.apply(this, arguments), {
            render: "body"
        });
    },

    _init: function () {
        BI.MaskersController.superclass._init.apply(this, arguments);
        this.zindex = BI.zIndex_masker;
    }
});