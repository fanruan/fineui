BI.DownListItem = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.DownListItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-down-list-item bi-list-item-active",
            cls: "",
            height: 25,
            logic: {
                dynamic: true
            },
            selected: false,
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.DownListItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.icon_text_item",
            element: this,
            height: o.height,
            text: o.text,
            value: o.value,
            logic: o.logic,
            selected: o.selected,
            disabled: o.disabled,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            textHgap: o.textHgap,
            textVgap: o.textVgap,
            textLgap: o.textLgap,
            textRgap: o.textRgap,
            father: o.father
        });
        this.text.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.text.on(BI.IconTextItem.EVENT_CHANGE, function () {
            self.fireEvent(BI.DownListItem.EVENT_CHANGE);
        });
        // this.setSelected(o.selected);
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    isSelected: function () {
        return this.text.isSelected();
    },

    setSelected: function (b) {
        this.text.setSelected(b);
        // if (b === true) {
        //     this.element.addClass("dot-e-font");
        // } else {
        //     this.element.removeClass("dot-e-font");
        // }
    },

    setValue: function (v) {
        this.text.setValue(v);
    },

    getValue: function () {
        return this.text.getValue();
    }
});
BI.DownListItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.down_list_item", BI.DownListItem);