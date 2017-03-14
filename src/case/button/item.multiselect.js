/**
 * guy
 * 复选框item
 * @type {*|void|Object}
 */
BI.MultiSelectItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function() {
        return BI.extend(BI.MultiSelectItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multi-select-item",
            height: 25,
            logic: {
                dynamic: false
            }
        })
    },
    _init : function() {
        BI.MultiSelectItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.checkbox"
        });
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            rgap: o.rgap,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function(type){
            if(type ===  BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
        });

        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", {
                type: "bi.center_adapt",
                items: [this.checkbox],
                width: 36
            } ,this.text)
        }))));
    },

    doRedMark: function(){
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function(){
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function(){
        BI.MultiSelectItem.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
    },

    setSelected: function(v){
        BI.MultiSelectItem.superclass.setSelected.apply(this, arguments);
        this.checkbox.setSelected(v);
    }
});

$.shortcut("bi.multi_select_item", BI.MultiSelectItem);