/**
 * guy
 * 由一个元素切换到另一个元素的行为
 * @class BI.EffectShowAction
 * @extends BI.Action
 */
BI.EffectShowAction = BI.inherit(BI.Action, {
    _defaultConfig: function() {
        return BI.extend(BI.EffectShowAction.superclass._defaultConfig.apply(this, arguments), {
        });
    },

    _init : function() {
        BI.EffectShowAction.superclass._init.apply(this, arguments);
    },

    _checkBrowser: function(){
        return false;
//        return !(BI.isFireFox() && parseInt($.browser.version) < 10);
    },

    actionPerformed: function(src, tar, callback){
        src = src || this.options.src ,tar = tar || this.options.tar || "body";

        if(this._checkBrowser()) {
            var transferEl = BI.createWidget({
                type: "bi.layout",
                cls: "bi-transfer-temp-el"
            })

            BI.createWidget({
                type: "bi.absolute",
                element: "body",
                items: [transferEl]
            })

            transferEl.element.css({
                width: tar.element.width(),
                height: tar.element.height(),
                top: tar.element.offset().top,
                left: tar.element.offset().left
            });

            src.element.effect("transfer", {
                to: transferEl.element,
                className: "ui-effects-transfer"
            }, 400, function () {
                transferEl.destroy();
                tar && tar.element.show(0, callback);
            })
        } else {
            tar && tar.element.show(0, callback);
        }
    },

    actionBack: function(tar, src, callback){
        src = src || this.options.src || $("body"),tar = tar || this.options.tar;
        tar && tar.element.hide();
        if(this._checkBrowser()) {
            var transferEl = BI.createWidget({
                type: "bi.layout",
                cls: "bi-transfer-temp-el"
            })

            BI.createWidget({
                type: "bi.absolute",
                element: "body",
                items: [transferEl]
            })
            transferEl.element.css({
                width: src.element.width(),
                height: src.element.height(),
                top: src.element.offset().top,
                left: src.element.offset().left
            });

            tar.element.effect("transfer", {
                to: transferEl.element,
                className: "ui-effects-transfer"
            }, 400, function () {
                transferEl.destroy();
                callback && callback();
            })
        } else {
            callback && callback();
        }
    }
});