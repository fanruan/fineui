BI.DownListItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.DownListItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-down-list-item bi-list-item-active",
            cls: "",
            height: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
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
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "left",
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height
        });
        this.icon = BI.createWidget({
            type: "bi.center_adapt",
            width: 36,
            height: o.height,
            items: [{
                el: {
                    type: "bi.icon",
                    width: o.iconWidth,
                    height: o.iconHeight
                }
            }]
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left), BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, this.icon, this.text)
        }))));
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
    },

    doClick: function () {
        BI.DownListItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.DownListItem.EVENT_CHANGE, this.getValue(), this);
        }
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    }
});
BI.DownListItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.down_list_item", BI.DownListItem);