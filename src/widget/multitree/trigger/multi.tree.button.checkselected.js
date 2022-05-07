/**
 * 查看已选按钮
 * Created by guy on 15/11/3.
 * @class BI.MultiTreeCheckSelectedButton
 * @extends BI.Single
 */
BI.MultiTreeCheckSelectedButton = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeCheckSelectedButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-check-selected-button",
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreeCheckSelectedButton.superclass._init.apply(this, arguments);
        var self = this;
        this.indicator = BI.createWidget({
            type: "bi.icon_button",
            cls: "check-font trigger-check-selected icon-size-12",
            width: 15,
            height: 15,
            stopPropagation: true
        });

        this.checkSelected = BI.createWidget({
            type: "bi.text_button",
            cls: "bi-high-light-background trigger-check-text",
            invisible: true,
            hgap: 4,
            text: BI.i18nText("BI-Check_Selected"),
            textAlign: "center",
            textHeight: 15
        });
        this.checkSelected.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.checkSelected.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedButton.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.horizontal",
            element: this,
            items: [this.indicator, this.checkSelected]
        });

        this.element.hover(function () {
            self.indicator.setVisible(false);
            self.checkSelected.setVisible(true);
        }, function () {
            self.indicator.setVisible(true);
            self.checkSelected.setVisible(false);
        });
        this.setVisible(false);
    },

    setValue: function (v) {
        v || (v = {});
        var show = BI.size(v.value) > 0;
        this.setVisible(show);
    }
});

BI.MultiTreeCheckSelectedButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_tree_check_selected_button", BI.MultiTreeCheckSelectedButton);