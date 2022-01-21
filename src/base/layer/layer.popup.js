/**
 * 下拉框弹出层, zIndex在1000w
 * @class BI.PopupView
 * @extends BI.Widget
 */
BI.PopupView = BI.inherit(BI.Widget, {
    _const: {
        TRIANGLE_LENGTH: 9
    },
    _defaultConfig: function (props) {
        return BI.extend(BI.PopupView.superclass._defaultConfig.apply(this, arguments), {
            _baseCls: "bi-popup-view" + (props.primary ? " bi-primary" : ""),
            // 品牌色
            primary: false,
            maxWidth: "auto",
            minWidth: 100,
            // maxHeight: 200,
            minHeight: 24,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            vgap: 0,
            hgap: 0,
            innerVGap: 0,
            innerHGap: 0,
            showArrow: true,
            direction: BI.Direction.Top, // 工具栏的方向
            stopEvent: false, // 是否停止mousedown、mouseup事件
            stopPropagation: false, // 是否停止mousedown、mouseup向上冒泡
            logic: {
                dynamic: true
            },

            tool: false, // 自定义工具栏
            tabs: [], // 导航栏
            buttons: [], // toolbar栏

            el: {
                type: "bi.button_group",
                items: [],
                chooseType: 0,
                behaviors: {},
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        });
    },

    render: function () {
        var self = this, o = this.options;
        var fn = function (e) {
            e.stopPropagation();
        }, stop = function (e) {
            e.stopEvent();
            return false;
        };
        this.element.css({
            "z-index": BI.zIndex_popup,
            "min-width": BI.isNumeric(o.minWidth) ? (o.minWidth / BI.pixRatio + BI.pixUnit) : o.minWidth,
            "max-width": BI.isNumeric(o.maxWidth) ? (o.maxWidth / BI.pixRatio + BI.pixUnit) : o.maxWidth
        }).bind({click: fn});

        this.element.bind("mousewheel", fn);

        o.stopPropagation && this.element.bind({mousedown: fn, mouseup: fn, mouseover: fn});
        o.stopEvent && this.element.bind({mousedown: stop, mouseup: stop, mouseover: stop});
        this.tool = this._createTool();
        this.tab = this._createTab();
        this.view = this._createView();
        this.toolbar = this._createToolBar();

        this.view.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.PopupView.EVENT_CHANGE);
            }
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
            scrolly: false,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            vgap: o.vgap,
            hgap: o.hgap,
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, BI.extend({
                    cls: "list-view-outer bi-card list-view-shadow" + (o.primary ? " bi-primary" : "")
                }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
                    items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.tool, this.tab, this.view, this.toolbar)
                })))
            )
        }))));
        if (o.showArrow) {
            this.arrow = BI.createWidget({
                type: "bi.absolute",
                cls: "bi-bubble-arrow",
                items: [{
                    type: "bi.layout",
                    cls: "bubble-arrow"
                }]
            });
            // 因为三角符号的原因位置变大了，需要占位
            this.placeholder = BI.createWidget({
                type: "bi.layout"
            });
            BI.createWidget({
                type: "bi.absolute",
                element: this,
                items: [{
                    el: this.arrow
                }, {
                    el: this.placeholder
                }]
            });
        }
    },

    _createView: function () {
        var o = this.options;
        this.button_group = BI.createWidget(o.el, {type: "bi.button_group", value: o.value});
        this.button_group.element.css({
            "min-height": BI.isNumeric(o.minHeight) ? (o.minHeight / BI.pixRatio + BI.pixUnit) : o.minHeight,
            "padding-top": o.innerVGap / BI.pixRatio + BI.pixUnit,
            "padding-bottom": o.innerVGap / BI.pixRatio + BI.pixUnit,
            "padding-left": o.innerHGap / BI.pixRatio + BI.pixUnit,
            "padding-right": o.innerHGap / BI.pixRatio + BI.pixUnit
        });
        return this.button_group;
    },

    _createTool: function () {
        var o = this.options;
        if (false === o.tool) {
            return;
        }
        return BI.createWidget(o.tool);
    },

    _createTab: function () {
        var o = this.options;
        if (o.tabs.length === 0) {
            return;
        }
        return BI.createWidget({
            type: "bi.center",
            cls: "list-view-tab",
            height: 25,
            items: o.tabs,
            value: o.value
        });
    },

    _createToolBar: function () {
        var o = this.options;
        if (o.buttons.length === 0) {
            return;
        }

        return BI.createWidget({
            type: "bi.center",
            cls: "list-view-toolbar bi-high-light bi-split-top",
            height: 24,
            items: BI.createItems(o.buttons, {
                once: false,
                shadow: true,
                isShadowShowingOnSelected: true
            })
        });
    },

    setDirection: function (direction, size) {
        if (this.options.showArrow) {
            var style, placeholderStyle;
            switch (direction) {
                case "bottom":
                case "bottom,right":
                    direction = "bottom";
                    style = {
                        left: size.width / 2 - 6
                    };
                    placeholderStyle = {
                        width: size.width,
                        left: 0,
                        right: 0,
                        height: this._const.TRIANGLE_LENGTH,
                        top: -this._const.TRIANGLE_LENGTH,
                        bottom: ""
                    };
                    break;
                case "bottom,left":
                    direction = "bottom";
                    style = {
                        right: size.width / 2 - 6
                    };
                    placeholderStyle = {
                        width: size.width,
                        left: 0,
                        right: 0,
                        height: this._const.TRIANGLE_LENGTH,
                        top: -this._const.TRIANGLE_LENGTH,
                        bottom: ""
                    };
                    break;
                case "top":
                case "top,right":
                    direction = "top";
                    style = {
                        left: size.width / 2 - 6
                    };
                    placeholderStyle = {
                        width: size.width,
                        left: 0,
                        right: 0,
                        height: this._const.TRIANGLE_LENGTH,
                        top: "",
                        bottom: -this._const.TRIANGLE_LENGTH
                    };
                    break;
                case "top,left":
                    direction = "top";
                    style = {
                        right: size.width / 2 - 6
                    };
                    placeholderStyle = {
                        width: size.width,
                        left: 0,
                        right: 0,
                        height: this._const.TRIANGLE_LENGTH,
                        top: -this._const.TRIANGLE_LENGTH,
                        bottom: ""
                    };
                    break;
                case "left":
                case "left,bottom":
                    direction = "left";
                    style = {
                        top: size.height / 2 - 6
                    };
                    placeholderStyle = {
                        height: size.height,
                        top: 0,
                        bottom: 0,
                        width: this._const.TRIANGLE_LENGTH,
                        right: -this._const.TRIANGLE_LENGTH,
                        left: ""
                    };
                    break;
                case "left,top":
                    direction = "left";
                    style = {
                        bottom: size.height / 2 - 6
                    };
                    placeholderStyle = {
                        height: size.height,
                        top: 0,
                        bottom: 0,
                        width: this._const.TRIANGLE_LENGTH,
                        right: -this._const.TRIANGLE_LENGTH,
                        left: ""
                    };
                    break;
                case "right":
                case "right,bottom":
                    direction = "right";
                    style = {
                        top: size.height / 2 - 6
                    };
                    placeholderStyle = {
                        height: size.height,
                        top: 0,
                        bottom: 0,
                        width: this._const.TRIANGLE_LENGTH,
                        left: -this._const.TRIANGLE_LENGTH,
                        right: ""
                    };
                    break;
                case "right,top":
                    direction = "right";
                    style = {
                        bottom: size.height / 2 - 6
                    };
                    placeholderStyle = {
                        height: size.height,
                        top: 0,
                        bottom: 0,
                        width: this._const.TRIANGLE_LENGTH,
                        left: -this._const.TRIANGLE_LENGTH,
                        right: ""
                    };
                    break;
                case "right,innerRight":
                    break;
                case "right,innerLeft":
                    break;
                case "innerRight":
                    break;
                case "innerLeft":
                    break;
            }
            this.element.removeClass("left").removeClass("right").removeClass("top").removeClass("bottom").addClass(direction);
            this.arrow.element.css(style);
            this.placeholder.element.css(placeholderStyle);
        }
    },

    getView: function () {
        return this.view;
    },

    populate: function (items) {
        this.view.populate.apply(this.view, arguments);
    },

    resetWidth: function (w) {
        this.options.width = w;
        this.element.width(w);
    },

    resetHeight: function (h) {
        var tbHeight = this.toolbar ? (this.toolbar.attr("height") || 24) : 0,
            tabHeight = this.tab ? (this.tab.attr("height") || 24) : 0,
            toolHeight = ((this.tool && this.tool.attr("height")) || 24) * ((this.tool && this.tool.isVisible()) ? 1 : 0);
        var resetHeight = h - tbHeight - tabHeight - toolHeight - 2 * this.options.innerVGap;
        this.view.resetHeight ? this.view.resetHeight(resetHeight) :
            this.view.element.css({"max-height": resetHeight / BI.pixRatio + BI.pixUnit});
    },

    setValue: function (selectedValues) {
        this.tab && this.tab.setValue(selectedValues);
        this.view.setValue(selectedValues);
    },

    getValue: function () {
        return this.view.getValue();
    }
});
BI.PopupView.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.popup_view", BI.PopupView);
