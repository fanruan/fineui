/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/8/25.
 * @class BI.MultiSelectBar
 * @extends BI.BasicButton
 */
BI.MultiSelectBar = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectBar.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multi-select-bar",
            height: 25,
            text: BI.i18nText("BI-Select_All"),
            isAllCheckedBySelectedValue: BI.emptyFn,
            // 手动控制选中
            disableSelected: true,
            isHalfCheckedBySelectedValue: function (selectedValues) {
                return selectedValues.length > 0;
            },
            halfSelected: false,
            iconWrapperWidth: 26,
            iconWidth: 14,
            iconHeight: 14,
        });
    },
    _init: function () {
        BI.MultiSelectBar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var isSelect = o.selected === true;
        var isHalfSelect = !o.selected && o.halfSelected;
        this.checkbox = BI.createWidget({
            type: "bi.checkbox",
            stopPropagation: true,
            handler: function () {
                self.setSelected(self.isSelected());
            },
            selected: isSelect,
            invisible: isHalfSelect,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        this.half = BI.createWidget({
            type: "bi.half_icon_button",
            stopPropagation: true,
            handler: function () {
                self.setSelected(true);
            },
            invisible: isSelect || !isHalfSelect,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, self.isSelected(), self);
        });
        this.checkbox.on(BI.Checkbox.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectBar.EVENT_CHANGE, self.isSelected(), self);
        });
        this.half.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, self.isSelected(), self);
        });
        this.half.on(BI.HalfIconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectBar.EVENT_CHANGE, self.isSelected(), self);
        });
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                width: o.iconWrapperWidth,
                el: {
                    type: "bi.center_adapt",
                    items: [this.checkbox, this.half]
                }
            }, {
                el: this.text
            }]
        });
    },

    _setSelected: function (v) {
        this.checkbox.setSelected(!!v);
    },

    // 自己手动控制选中
    beforeClick: function () {
        var isHalf = this.isHalfSelected(), isSelected = this.isSelected();
        if (isHalf === true) {
            this.setSelected(true);
        } else {
            this.setSelected(!isSelected);
        }
    },

    setSelected: function (v) {
        this.checkbox.setSelected(v);
        this.setHalfSelected(false);
    },

    setHalfSelected: function (b) {
        this.halfSelected = !!b;
        if (b === true) {
            this.checkbox.setSelected(false);
            this.half.visible();
            this.checkbox.invisible();
        } else {
            this.half.invisible();
            this.checkbox.visible();
        }
    },

    isHalfSelected: function () {
        return !this.isSelected() && !!this.halfSelected;
    },

    isSelected: function () {
        return this.checkbox.isSelected();
    },

    setValue: function (selectedValues) {
        BI.MultiSelectBar.superclass.setValue.apply(this, arguments);
        var isAllChecked = this.options.isAllCheckedBySelectedValue.apply(this, arguments);
        this.setSelected(isAllChecked);
        !isAllChecked && this.setHalfSelected(this.options.isHalfCheckedBySelectedValue.apply(this, arguments));
    },

    doClick: function () {
        BI.MultiSelectBar.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.MultiSelectBar.EVENT_CHANGE, this.isSelected(), this);
        }
    }
});
BI.MultiSelectBar.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_select_bar", BI.MultiSelectBar);
