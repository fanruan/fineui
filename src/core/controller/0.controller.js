/**
 * guy
 * 控制器
 * Controller层超类
 * @class BI.Controller
 * @extends BI.OB
 * @abstract
 */
BI.Controller = BI.inherit(BI.OB, {
    _defaultConfig: function () {
        return BI.extend(BI.Controller.superclass._defaultConfig.apply(this, arguments), {

        });
    }
});
BI.Controller.EVENT_CHANGE = "__EVENT_CHANGE__";
