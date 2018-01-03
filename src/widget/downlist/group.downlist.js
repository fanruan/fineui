/**
 * Created by roy on 15/9/6.
 */
BI.DownListGroup = BI.inherit(BI.Widget, {
    constants: {
        iconCls: "check-mark-ha-font"
    },
    _defaultConfig: function () {
        return BI.extend(BI.DownListGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-down-list-group",
            items: [
                {
                    el: {}
                }
            ]
        });
    },
    _init: function () {
        BI.DownListGroup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;

        this.downlistgroup = BI.createWidget({
            element: this,
            type: "bi.button_tree",
            items: o.items,
            chooseType: 0, // 0单选，1多选
            layouts: [{
                type: "bi.vertical",
                hgap: 0,
                vgap: 0
            }]
        });
        this.downlistgroup.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if(type === BI.Events.CLICK) {
                self.fireEvent(BI.DownListGroup.EVENT_CHANGE, arguments);
            }
        });
    },
    getValue: function () {
        return this.downlistgroup.getValue();
    },
    setValue: function (v) {
        this.downlistgroup.setValue(v);
    }


});
BI.DownListGroup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.down_list_group", BI.DownListGroup);