/**
 * 可以改变图标的button
 *
 * Created by GUY on 2016/2/2.
 *
 * @class BI.IconChangeButton
 * @extends BI.Single
 */
BI.IconChangeButton = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.IconChangeButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-icon-change-button",
            iconClass: "",
            iconWidth: null,
            iconHeight: null,

            stopEvent: false,
            stopPropagation: false,
            selected: false,
            once: false, //点击一次选中有效,再点无效
            forceSelected: false, //点击即选中， 选中了就不会被取消
            forceNotSelected: false, //无论怎么点击都不会被选中
            disableSelected: false, //使能选中

            shadow: false,
            isShadowShowingOnSelected: false,  //选中状态下是否显示阴影
            trigger: null,
            handler: BI.emptyFn
        })
    },

    _init: function () {
        BI.IconChangeButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.button = BI.createWidget({
            type: "bi.icon_button",
            element: this.element,
            cls: o.iconClass,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight,

            stopEvent: o.stopEvent,
            stopPropagation: o.stopPropagation,
            selected: o.selected,
            once: o.once,
            forceSelected: o.forceSelected,
            forceNotSelected: o.forceNotSelected,
            disableSelected: o.disableSelected,

            shadow: o.shadow,
            isShadowShowingOnSelected: o.isShadowShowingOnSelected,
            trigger: o.trigger,
            handler: o.handler
        });

        this.button.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button.on(BI.IconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.IconChangeButton.EVENT_CHANGE, arguments);
        });
    },

    isSelected: function () {
        return this.button.isSelected();
    },

    setSelected: function (b) {
        this.button.setSelected(b);
    },

    setIcon: function (cls) {
        var o = this.options;
        if (o.iconClass !== cls) {
            this.element.removeClass(o.iconClass).addClass(cls);
            o.iconClass = cls;
        }
    },

    setEnable: function (b) {
        BI.IconChangeButton.superclass.setEnable.apply(this, arguments);
        this.button.setEnable(b);
    }
});
BI.IconChangeButton.EVENT_CHANGE = "IconChangeButton.EVENT_CHANGE";
$.shortcut("bi.icon_change_button", BI.IconChangeButton);