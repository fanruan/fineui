/**
 * 弹出层
 * @class BI.PopoverSection
 * @extends BI.Widget
 * @abstract
 */
BI.PopoverSection = BI.inherit(BI.Widget, {
    _init : function() {
        BI.PopoverSection.superclass._init.apply(this, arguments);
    },

    rebuildNorth : function(north) {
        return true;
    },
    rebuildCenter : function(center) {},
    rebuildSouth : function(south) {
        return false;
    },
    close: function(){
        this.fireEvent(BI.PopoverSection.EVENT_CLOSE);
    },
    end: function(){

    }
});
BI.PopoverSection.EVENT_CLOSE = "EVENT_CLOSE";