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
    }
});
BI.ImageCheckbox.EVENT_CHANGE = BI.IconButton.EVENT_CHANGE;

BI.shortcut("bi.image_checkbox", BI.ImageCheckbox);