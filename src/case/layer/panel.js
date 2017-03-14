/**
 * 带有标题栏的pane
 * @class BI.Panel
 * @extends BI.Widget
 */
BI.Panel = BI.inherit(BI.Widget,{
    _defaultConfig : function(){
        return BI.extend(BI.Panel.superclass._defaultConfig.apply(this,arguments),{
            baseCls: "bi-panel",
            title:"",
            titleButtons:[],
            el:{},
            logic:{
                dynamic: false
            }
        });
    },

    _init:function(){
        BI.Panel.superclass._init.apply(this,arguments);
        var o = this.options;

        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic("vertical", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("top", this._createTitle()
                ,this.options.el)
        }))));
    },

    _createTitle:function(){
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "panel-title-text",
            text: o.title,
            height: 30
        });

        this.button_group = BI.createWidget({
            type:"bi.button_group",
            items: o.titleButtons,
            layouts: [{
                type: "bi.center_adapt",
                lgap:10
            }]
        });

        this.button_group.on(BI.Controller.EVENT_CHANGE, function(){
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.button_group.on(BI.ButtonGroup.EVENT_CHANGE, function(value, obj){
            self.fireEvent(BI.Panel.EVENT_CHANGE, value, obj);
        });

        return {
            el: {
                type: "bi.left_right_vertical_adapt",
                cls: "panel-title",
                height: 30,
                items: {
                    left: [this.text],
                    right: [this.button_group]
                },
                lhgap: 10,
                rhgap: 10
            },
            height: 30
        };
    },

    setTitle: function(title){
        this.text.setValue(title);
    }
});
BI.Panel.EVENT_CHANGE = "Panel.EVENT_CHANGE";

$.shortcut("bi.panel",BI.Panel);