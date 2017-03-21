/**
 * Arrangement的drop面板
 *
 * Created by GUY on 2016/3/1.
 * @class BI.ArrangementDroppable
 * @extends BI.Widget
 */
BI.ArrangementDroppable = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ArrangementDroppable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-arrangement-droppable"
        });
    },

    _init: function () {
        BI.ArrangementDroppable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        
    }
});
$.shortcut('bi.arrangement_droppable', BI.ArrangementDroppable);