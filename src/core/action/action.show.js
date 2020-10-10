/**
 * guy
 * 由一个元素切换到另一个元素的行为
 * @class BI.ShowAction
 * @extends BI.Action
 */
BI.ShowAction = BI.inherit(BI.Action, {
    _defaultConfig: function () {
        return BI.extend(BI.ShowAction.superclass._defaultConfig.apply(this, arguments), {});
    },

    actionPerformed: function (src, tar, callback) {
        tar = tar || this.options.tar;
        tar.setVisible(true);
        callback && callback();
    },

    actionBack: function (tar, src, callback) {
        tar = tar || this.options.tar;
        tar.setVisible(false);
        callback && callback();
    }
});
