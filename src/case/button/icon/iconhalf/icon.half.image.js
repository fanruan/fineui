/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.HalfIconButton = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        var conf = BI.HalfIconButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-half-icon-button check-half-select-icon",
            height: 16,
            width: 16,
            iconWidth: 16,
            iconHeight: 16,
            selected: false
        });
    }
});
BI.HalfIconButton.EVENT_CHANGE = BI.IconButton.EVENT_CHANGE;

BI.shortcut("bi.half_icon_button", BI.HalfIconButton);