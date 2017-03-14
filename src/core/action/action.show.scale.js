/**
 * guy
 * 由一个元素切换到另一个元素的行为
 * @class BI.ScaleShowAction
 * @extends BI.Action
 * @abstract
 */
BI.ScaleShowAction = BI.inherit(BI.Action, {
    _defaultConfig: function() {
        return BI.extend(BI.ScaleShowAction.superclass._defaultConfig.apply(this, arguments), {
        });
    },

    _init : function() {
        BI.ScaleShowAction.superclass._init.apply(this, arguments);
    },

    _checkBrowser: function(){
        return false;
//        return !(BI.isFireFox() && parseInt($.browser.version) < 10);
    },

    actionPerformed: function(src, tar, callback){
        tar = tar || this.options.tar;
        this._checkBrowser() ? tar.element.show("scale", {percent:110}, 200, callback) : tar.element.show(0,callback);
    },

    actionBack : function(tar, src, callback){
        tar = tar || this.options.tar;
        this._checkBrowser() ? tar.element.hide("scale", {percent:0}, 200, callback) : tar.element.hide(0,callback);
    }
});