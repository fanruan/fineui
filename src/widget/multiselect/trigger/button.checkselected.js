/**
 * 查看已选按钮
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectCheckSelectedButton
 * @extends BI.Single
 */
BI.MultiSelectCheckSelectedButton = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCheckSelectedButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-check-selected-button",
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectCheckSelectedButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.numberCounter = BI.createWidget({
            type: "bi.text_button",
            element: this,
            hgap: 4,
            text: "0",
            textAlign: "center",
            textHeight: 16,
            cls: "bi-high-light-background count-tip"
        });
        this.numberCounter.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.numberCounter.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedButton.EVENT_CHANGE, arguments);
        });

        this.numberCounter.element.hover(function () {
            self.numberCounter.setTag(self.numberCounter.getText());
            self.numberCounter.setText(BI.i18nText("BI-Check_Selected"));
        }, function () {
            self.numberCounter.setText(self.numberCounter.getTag());
        });
        this.setVisible(false);
        if(BI.isNotNull(o.value)){
            this.setValue(o.value);
        }
    },

    _populate: function (ob) {
        var self = this, o = this.options;
        if (ob.type === BI.Selection.All) {
            o.itemsCreator({
                type: BI.MultiSelectCombo.REQ_GET_DATA_LENGTH
            }, function (res) {
                if (BI.isNotEmptyString(res.count)) {
                    BI.nextTick(function () {
                        self.numberCounter.setText(res.count);
                        self.setVisible(true);
                    });

                    return;
                }
                var length = res.count - ob.value.length;
                BI.nextTick(function () {
                    self.numberCounter.setText(length);
                    self.setVisible(length > 0);
                });
            });
            return;
        }
        BI.nextTick(function () {
            self.numberCounter.setText(ob.value.length);
            self.setVisible(ob.value.length > 0);
        });
    },

    _assertValue: function (ob) {
        ob || (ob = {});
        ob.type || (ob.type = BI.Selection.Multi);
        ob.value || (ob.value = []);
        return ob;
    },

    setValue: function (ob) {
        ob = this._assertValue(ob);
        this.options.value = ob;
        this._populate(ob);
    },

    populate: function () {
        this._populate(this._assertValue(this.options.value));
    },

    getValue: function () {

    }
});

BI.MultiSelectCheckSelectedButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_select_check_selected_button", BI.MultiSelectCheckSelectedButton);
