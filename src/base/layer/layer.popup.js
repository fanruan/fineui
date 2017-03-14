/**
 * 下拉框弹出层, zIndex在1000w
 * @class BI.PopupView
 * @extends BI.Widget
 */
BI.PopupView = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.PopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-list-view",
            maxWidth: 'auto',
            minWidth: 100,
            //maxHeight: 200,
            minHeight: 25,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            vgap: 0,
            hgap: 0,
            direction: BI.Direction.Top, //工具栏的方向
            stopEvent: false,//是否停止mousedown、mouseup事件
            stopPropagation: false, //是否停止mousedown、mouseup向上冒泡
            logic: {
                dynamic: true
            },

            tool: false, //自定义工具栏
            tabs: [], //导航栏
            buttons: [], //toolbar栏

            el: {
                type: "bi.button_group",
                items: [],
                chooseType: 0,
                behaviors: {},
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        })
    },

    _init: function () {
        BI.PopupView.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var fn = function (e) {
            e.stopPropagation();
        }, stop = function (e) {
            e.stopEvent();
            return false;
        };
        this.element.css({
            "z-index": BI.zIndex_popup,
            "min-width": o.minWidth + "px",
            "max-width": o.maxWidth + "px"
        }).bind({"click": fn, "mousewheel": fn});

        o.stopPropagation && this.element.bind({"mousedown": fn, "mouseup": fn, "mouseover": fn});
        o.stopEvent && this.element.bind({"mousedown": stop, "mouseup": stop, "mouseover": stop});
        this.tool = this._createTool();
        this.tab = this._createTab();
        this.view = this._createView();
        this.toolbar = this._createToolBar();

        this.button_group.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.PopupView.EVENT_CHANGE);
            }
        });

        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
            scrolly: false,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            vgap: o.vgap,
            hgap: o.hgap,
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction,
                BI.extend({
                    cls: "list-view-outer"
                }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
                    items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.tool, this.tab, this.view, this.toolbar)
                })))
            )
        }))));
    },

    _createView: function () {
        var o = this.options;
        this.button_group = BI.createWidget(o.el, {type: "bi.button_group"});
        this.button_group.element.css({"min-height": o.minHeight + "px"});
        return this.button_group;
    },

    _createTool: function () {
        var o = this.options;
        if (false === o.tool) {
            return;
        }
        return BI.createWidget(o.tool)
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
            items: o.tabs
        })
    },

    _createToolBar: function () {
        var o = this.options;
        if (o.buttons.length === 0) {
            return;
        }

        return BI.createWidget({
            type: "bi.center",
            cls: "list-view-toolbar",
            height: 30,
            items: BI.createItems(o.buttons, {
                once: false,
                shadow: true,
                isShadowShowingOnSelected: true
            })
        })
    },

    populate: function (items) {
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetWidth: function (w) {
        this.options.width = w;
        this.element.width(w);
    },

    resetHeight: function (h) {
        var tbHeight = 30 * (this.toolbar ? 1 : 0),
            tabHeight = 25 * (this.tab ? 1 : 0),
            toolHeight = ((this.tool && this.tool.element.outerHeight()) || 25) * ((this.tool && this.tool.isVisible()) ? 1 : 0);
        this.view.resetHeight ? this.view.resetHeight(h - tbHeight - tabHeight - toolHeight - 2) :
            this.view.element.css({"max-height": (h - tbHeight - tabHeight - toolHeight - 2) + "px"})
    },

    setEnable: function (arg) {
        BI.PopupView.superclass.setEnable.apply(this, arguments);
        this.view && this.view.setEnable(arg);
    },

    setValue: function (selectedValues) {
        this.tab && this.tab.setValue(selectedValues);
        this.button_group.setValue(selectedValues);
    },

    getValue: function () {
        return this.button_group.getValue();
    }
});
BI.PopupView.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.popup_view", BI.PopupView);