/**
 * 查看已选按钮
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectCheckSelectedButton
 * @extends BI.Single
 */
BI.MultiSelectCheckSelectedButton = BI.inherit(BI.Single, {

    _const: {
        checkSelected: BI.i18nText('BI-Check_Selected')
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCheckSelectedButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-check-selected-button bi-high-light',
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectCheckSelectedButton.superclass._init.apply(this, arguments);
        var self = this;
        this.numberCounter = BI.createWidget({
            type: 'bi.text_button',
            element: this,
            hgap: 4,
            text: "0",
            textAlign: 'center',
            textHeight: 15
        });
        this.numberCounter.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.numberCounter.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedButton.EVENT_CHANGE, arguments);
        });

        this.numberCounter.element.hover(function () {
            self.numberCounter.setTag(self.numberCounter.getText());
            self.numberCounter.setText(self._const.checkSelected);
        }, function () {
            self.numberCounter.setText(self.numberCounter.getTag());
        });
        this.setVisible(false);
    },

    setValue: function (ob) {
        var self = this, o = this.options;
        ob || (ob = {});
        ob.type || (ob.type = BI.Selection.Multi);
        ob.value || (ob.value = []);
        if (ob.type === BI.Selection.All) {
            o.itemsCreator({
                type: BI.MultiSelectCombo.REQ_GET_DATA_LENGTH
            }, function (res) {
                var length = res.count - ob.value.length;
                BI.nextTick(function(){
                    self.numberCounter.setText(length);
                    self.setVisible(length > 0);
                });
            });
            return;
        }
        BI.nextTick(function(){
            self.numberCounter.setText(ob.value.length);
            self.setVisible(ob.value.length > 0);
        })
    },

    getValue: function () {

    }
});

BI.MultiSelectCheckSelectedButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.multi_select_check_selected_button', BI.MultiSelectCheckSelectedButton);