/**
 * Created by GUY on 2017/2/8.
 *
 * @class BI.BubbleCombo
 * @extends BI.Widget
 */
BI.BubbleCombo = BI.inherit(BI.Widget, {
    _const: {
        TRIANGLE_LENGTH: 6
    },
    _defaultConfig: function () {
        return BI.extend(BI.BubbleCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-bubble-combo",
            trigger: "click",
            toggle: true,
            direction: "bottom", //top||bottom||left||right||top,left||top,right||bottom,left||bottom,right
            isDefaultInit: false,
            isNeedAdjustHeight: true,//是否需要高度调整
            isNeedAdjustWidth: true,
            stopPropagation: false,
            adjustLength: 0,//调整的距离
            // adjustXOffset: 0,
            // adjustYOffset: 10,
            hideChecker: BI.emptyFn,
            offsetStyle: "left", //left,right,center
            el: {},
            popup: {},
        })
    },
    _init: function () {
        BI.BubbleCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            trigger: o.trigger,
            toggle: o.toggle,
            direction: o.direction,
            isDefaultInit: o.isDefaultInit,
            isNeedAdjustHeight: o.isNeedAdjustHeight,
            isNeedAdjustWidth: o.isNeedAdjustWidth,
            adjustLength: this._getAdjustLength(),
            stopPropagation: o.stopPropagation,
            adjustXOffset: 0,
            adjustYOffset: 0,
            hideChecker: o.hideChecker,
            offsetStyle: o.offsetStyle,
            el: o.el,
            popup: BI.extend({
                type: "bi.bubble_popup_view"
            }, o.popup),
        });
        this.combo.on(BI.Combo.EVENT_TRIGGER_CHANGE, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_TRIGGER_CHANGE, arguments);
        });
        this.combo.on(BI.Combo.EVENT_CHANGE, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_CHANGE, arguments);
        });
        this.combo.on(BI.Combo.EVENT_EXPAND, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_EXPAND, arguments);
        });
        this.combo.on(BI.Combo.EVENT_COLLAPSE, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_COLLAPSE, arguments);
        });
        this.combo.on(BI.Combo.EVENT_AFTER_INIT, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_AFTER_INIT, arguments);
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW, arguments);
        });
        this.combo.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self._showTriangle();
            self.fireEvent(BI.BubbleCombo.EVENT_AFTER_POPUPVIEW, arguments);
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_HIDEVIEW, function () {
            self._hideTriangle();
            self.fireEvent(BI.BubbleCombo.EVENT_BEFORE_HIDEVIEW, arguments);
        });
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_AFTER_HIDEVIEW, arguments);
        });
    },

    _getAdjustLength: function () {
        return this._const.TRIANGLE_LENGTH + this.options.adjustLength;
    },

    _createTriangle: function (direction) {
        var pos = {}, op = {};
        var adjustLength = this._getAdjustLength();
        switch (direction) {
            case "left":
                pos = {
                    top: 0,
                    bottom: 0,
                    left: -adjustLength
                };
                op = {width: this._const.TRIANGLE_LENGTH};
                break;
            case "right":
                pos = {
                    top: 0,
                    bottom: 0,
                    right: -adjustLength
                };
                op = {width: this._const.TRIANGLE_LENGTH};
                break;
            case "top":
                pos = {
                    left: 0,
                    right: 0,
                    top: -adjustLength
                };
                op = {height: this._const.TRIANGLE_LENGTH};
                break;
            case "bottom":
                pos = {
                    left: 0,
                    right: 0,
                    bottom: -adjustLength
                };
                op = {height: this._const.TRIANGLE_LENGTH};
                break;
            default:
                break;
        }
        this.triangle = BI.createWidget(op, {
            type: "bi.center_adapt",
            items: [{
                type: "bi.layout",
                cls: "bubble-combo-triangle-" + direction
            }]
        });
        pos.el = this.triangle;
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [pos]
        })
    },

    _createLeftTriangle: function () {
        this._createTriangle("left");
    },

    _createRightTriangle: function () {
        this._createTriangle("right");
    },

    _createTopTriangle: function () {
        this._createTriangle("top");
    },

    _createBottomTriangle: function () {
        this._createTriangle("bottom");
    },

    _showTriangle: function () {
        var pos = this.combo.getPopupPosition();
        switch (pos.dir) {
            case "left,top":
            case "left,bottom":
                this._createLeftTriangle();
                this.combo.getView().showLine("right");
                break;
            case "right,top":
            case "right,bottom":
                this._createRightTriangle();
                this.combo.getView().showLine("left");
                break;
            case "top,left":
            case "top,right":
                this._createTopTriangle();
                this.combo.getView().showLine("bottom");
                break;
            case "bottom,left":
            case "bottom,right":
                this._createBottomTriangle();
                this.combo.getView().showLine("top");
                break;
        }
    },

    _hideTriangle: function () {
        this.triangle && this.triangle.destroy();
        this.combo.getView().hideLine();
    },

    hideView: function () {
        this._hideTriangle();
        this.combo && this.combo.hideView();
    },

    showView: function () {
        this.combo && this.combo.showView();
    }
});

BI.BubbleCombo.EVENT_TRIGGER_CHANGE = "EVENT_TRIGGER_CHANGE";
BI.BubbleCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.BubbleCombo.EVENT_EXPAND = "EVENT_EXPAND";
BI.BubbleCombo.EVENT_COLLAPSE = "EVENT_COLLAPSE";
BI.BubbleCombo.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";


BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.BubbleCombo.EVENT_AFTER_POPUPVIEW = "EVENT_AFTER_POPUPVIEW";
BI.BubbleCombo.EVENT_BEFORE_HIDEVIEW = "EVENT_BEFORE_HIDEVIEW";
BI.BubbleCombo.EVENT_AFTER_HIDEVIEW = "EVENT_AFTER_HIDEVIEW";
BI.shortcut("bi.bubble_combo", BI.BubbleCombo);