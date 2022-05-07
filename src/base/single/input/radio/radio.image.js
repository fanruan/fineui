/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.ImageRadio = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        var conf = BI.ImageRadio.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-radio radio-icon",
            selected: false,
            handler: BI.emptyFn,
            width: 16,
            height: 16,
            iconWidth: 16,
            iconHeight: 16
        });
    },

    doClick: function () {
        BI.ImageRadio.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.ImageRadio.EVENT_CHANGE);
        }
    }
});
BI.ImageRadio.EVENT_CHANGE = BI.IconButton.EVENT_CHANGE;

BI.shortcut("bi.image_radio", BI.ImageRadio);
