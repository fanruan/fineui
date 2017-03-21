/**
 * Created by GUY on 2017/2/8.
 *
 * @class BI.BubblePopupView
 * @extends BI.PopupView
 */
BI.BubblePopupView = BI.inherit(BI.PopupView, {
    _defaultConfig: function () {
        var config = BI.BubblePopupView.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(config, {
            baseCls: config.baseCls + " bi-bubble-popup-view"
        })
    },
    _init: function () {
        BI.BubblePopupView.superclass._init.apply(this, arguments);
    },

    showLine: function (direction) {
        var pos = {}, op = {};
        switch (direction) {
            case "left":
                pos = {
                    top: 0,
                    bottom: 0,
                    left: -1
                };
                op = {width: 3};
                break;
            case "right":
                pos = {
                    top: 0,
                    bottom: 0,
                    right: -1
                };
                op = {width: 3};
                break;
            case "top":
                pos = {
                    left: 0,
                    right: 0,
                    top: -1
                };
                op = {height: 3};
                break;
            case "bottom":
                pos = {
                    left: 0,
                    right: 0,
                    bottom: -1
                };
                op = {height: 3};
                break;
            default:
                break;
        }
        this.line = BI.createWidget(op, {
            type: "bi.layout",
            cls: "bubble-popup-line"
        });
        pos.el = this.line;
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [pos]
        })
    },

    hideLine: function () {
        this.line && this.line.destroy();
    }
});

$.shortcut("bi.bubble_popup_view", BI.BubblePopupView);