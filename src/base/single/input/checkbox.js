/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.Checkbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function() {
        var conf = BI.Checkbox.superclass._defaultConfig.apply(this,arguments);
        return BI.extend(conf, {
            tagName: "a",
            baseCls: (conf.baseCls || "") + " bi-checkbox check-box-icon",
            selected: false,
            handler: BI.emptyFn,
            width: 16,
            height: 16,
            iconWidth: 16,
            iconHeight: 16
        })
    },

    _init : function() {
        BI.Checkbox.superclass._init.apply(this, arguments);
    },

    doClick: function(){
        BI.Checkbox.superclass.doClick.apply(this, arguments);
        if(this.isValid()){
            this.fireEvent(BI.Checkbox.EVENT_CHANGE);
        }
    }
});
BI.Checkbox.EVENT_CHANGE = "Checkbox.EVENT_CHANGE";

$.shortcut("bi.checkbox", BI.Checkbox);