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
            text: BI.i18nText('BI-Select_All'),
            isAllCheckedBySelectedValue: BI.emptyFn,
            onCheck: BI.emptyFn,
            isHalfCheckedBySelectedValue: function (selectedValues) {
                return selectedValues.length > 0;
            }
        })
    },
    _init: function () {
        BI.MultiSelectBar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.checkbox",
            stopPropagation: true,
            handler: function () {
                self.setSelected(self.isSelected());
                o.onCheck.call(self, self.isSelected());
            }
        });
        this.half = BI.createWidget({
            type: "bi.half_icon_button",
            stopPropagation: true,
            handler: function () {
                self.setSelected(true);
                o.onCheck.call(self, self.isSelected());
            }
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, self.isSelected(), self);
        });
        this.half.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, self.isSelected(), self);
        });
        this.half.on(BI.HalfIconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectBar.EVENT_CHANGE, self.isSelected(), self);
        });
        this.checkbox.on(BI.Checkbox.EVENT_CHANGE, function () {
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
            element: this.element,
            items: [{
                width: 36,
                el: {
                    type: "bi.center_adapt",
                    items: [this.checkbox, this.half]
                }
            }, {
                el: this.text
            }]
        });
        this.half.invisible();
    },

    doClick: function () {
        var isHalf = this.isHalfSelected(), isSelected = this.isSelected();
        if (isHalf === true) {
            this.setSelected(true);
        } else {
            this.setSelected(!isSelected);
        }

        if (this.isValid()) {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, this.getValue(), this);
            this.options.onCheck.call(this, this.isSelected());
            this.fireEvent(BI.MultiSelectBar.EVENT_CHANGE, this.isSelected(), this);
        }
    },

    setSelected: function (v) {
        this.checkbox.setSelected(v);
        this.setHalfSelected(false);
    },

    setHalfSelected: function (b) {
        this._half = !!b;
        if (b === true) {
            this.half.visible();
            this.checkbox.invisible();
        } else {
            this.half.invisible();
            this.checkbox.visible();
        }
    },

    isHalfSelected: function () {
        return !!this._half;
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

    setEnable: function (b) {
        BI.MultiSelectBar.superclass.setEnable.apply(this, arguments);
        this.checkbox.setEnable(b);
        this.half.setEnable(b);
        this.text.setEnable(b);
    }
});
BI.MultiSelectBar.EVENT_CHANGE = "MultiSelectBar.EVENT_CHANGE";
$.shortcut("bi.multi_select_bar", BI.MultiSelectBar);