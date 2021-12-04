/**
 * 表示一个可以展开的节点, 不仅有选中状态而且有展开状态
 *
 * Created by GUY on 2015/9/9.
 * @class BI.NodeButton
 * @extends BI.BasicButton
 * @abstract
 */
BI.NodeButton = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.NodeButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            _baseCls: (conf._baseCls || "") + " bi-node",
            open: false
        });
    },

    _initRef: function () {
        if (this.isOpened()) {
            this.setOpened(this.isOpened());
        }
        BI.NodeButton.superclass._initRef.apply(this, arguments);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
        this.setOpened(!this.isOpened());
    },

    isOnce: function () {
        return false;
    },

    isOpened: function () {
        return !!this.options.open;
    },

    setOpened: function (b) {
        this.options.open = !!b;
    },

    triggerCollapse: function () {
        if (this.isOpened()) {
            this.setOpened(false);
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, this.getValue(), this);
        }
    },

    triggerExpand: function () {
        if (!this.isOpened()) {
            this.setOpened(true);
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, this.getValue(), this);
        }
    }
});
BI.shortcut("bi.node_button", BI.NodeButton);
