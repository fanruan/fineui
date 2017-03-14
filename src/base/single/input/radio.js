/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.Radio = BI.inherit(BI.IconButton, {
    _defaultConfig: function() {
        var conf = BI.Radio.superclass._defaultConfig.apply(this,arguments);
        return BI.extend(conf, {
            tagName: "a",
            baseCls: (conf.baseCls || "") + " bi-radio radio-icon",
            selected: false,
            handler: BI.emptyFn,
            width: 16,
            height: 16,
            iconWidth: 16,
            iconHeight: 16
        })
    },

    _init : function() {
        BI.Radio.superclass._init.apply(this, arguments);
    },

    doClick: function(){
        BI.Radio.superclass.doClick.apply(this, arguments);
        if(this.isValid()){
            this.fireEvent(BI.Radio.EVENT_CHANGE);
        }
    }
});
BI.Radio.EVENT_CHANGE = "Radio.EVENT_CHANGE";

$.shortcut("bi.radio", BI.Radio);