/**
 * guy
 * 由一个元素切换到另一个元素的行为
 * @class BI.ShowAction
 * @extends BI.Action
 */
BI.ShowAction = BI.inherit(BI.Action, {
    _defaultConfig: function() {
        return BI.extend(BI.ShowAction.superclass._defaultConfig.apply(this, arguments), {
        });
    },

    _init : function() {
        BI.ShowAction.superclass._init.apply(this, arguments);
    },

    actionPerformed: function(src, tar, callback){
        tar = tar || this.options.tar;
        tar && tar.element.show(0, callback);
    },

    actionBack: function(tar, src, callback){
        tar = tar || this.options.tar;
        tar.element.hide(0, callback);
    }
});