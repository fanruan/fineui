BI.DownListGroupItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.DownListGroupItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-down-list-group-item",
            logic: {
                dynamic: false
            },
            // invalid: true,
            iconCls1: "dot-e-font",
            iconCls2: "pull-right-e-font"
        });
    },
    _init: function () {
        BI.DownListGroupItem.superclass._init.apply(this, arguments);
        var o = this.options;
        var self = this;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-group-item-text",
            textAlign: "left",
            text: o.text,
            value: o.value,
            height: o.height
        });

        this.icon1 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls1,
            width: 36,
            height: o.height,
            disableSelected: true,
            selected: this._digest(o.value)
        });

        this.icon2 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls2,
            width: 24,
            forceNotSelected: true
        });

        var blank = BI.createWidget({
            type: "bi.layout",
            width: 24
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.icon2,
                top: 0,
                bottom: 0,
                right: 0
            }]
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", this.icon1, this.text, blank)
        }))));

        this.element.hover(function () {
            if (self.isEnabled()) {
                self.hover();
            }
        }, function () {
            if (self.isEnabled()) {
                self.dishover();
            }
        });
    },

    _getLevel: function () {
        var child = BI.first(this.options.childValues);
        return BI.isNotNull(child) ? (child + "").split(BI.BlankSplitChar).length : 0;
    },

    _digest: function (v) {
        var self = this, o = this.options;
        v = BI.isArray(v) ? v : [v];
        var level = this._getLevel();
        return BI.any(v, function (idx, value) {
            return BI.contains(o.childValues, (value + "").split(BI.BlankSplitChar).slice(0, level).join(BI.BlankSplitChar));
        });
    },

    hover: function () {
        BI.DownListGroupItem.superclass.hover.apply(this, arguments);
        this.icon1.element.addClass("hover");
        this.icon2.element.addClass("hover");

    },

    dishover: function () {
        BI.DownListGroupItem.superclass.dishover.apply(this, arguments);
        this.icon1.element.removeClass("hover");
        this.icon2.element.removeClass("hover");
    },

    doClick: function () {
        BI.DownListGroupItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.DownListGroupItem.EVENT_CHANGE, this.getValue());
        }
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    setValue: function (v) {
        this.icon1.setSelected(this._digest(v));
    }
});
BI.DownListGroupItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.down_list_group_item", BI.DownListGroupItem);