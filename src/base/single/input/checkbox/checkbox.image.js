/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.ImageCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        var conf = BI.ImageCheckbox.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-image-checkbox check-box-icon",
            selected: false,
            handler: BI.emptyFn,
            width: 16,
            height: 16,
            iconWidth: 16,
            iconHeight: 16
        });
    },

    _init: function () {
        BI.ImageCheckbox.superclass._init.apply(this, arguments);
    },

    doClick: function () {
        BI.ImageCheckbox.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.Checkbox.EVENT_CHANGE);
        }
    }
});
BI.ImageCheckbox.EVENT_CHANGE = "Checkbox.EVENT_CHANGE";

BI.shortcut("bi.image_checkbox", BI.ImageCheckbox);