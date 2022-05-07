/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.HalfButton = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.HalfIconButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-half-button bi-high-light-border",
            height: 14,
            width: 14,
            selected: false
        });
    },

    doClick: function () {
        BI.HalfButton.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.HalfButton.EVENT_CHANGE);
        }
    }
});
BI.HalfButton.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.half_button", BI.HalfButton);