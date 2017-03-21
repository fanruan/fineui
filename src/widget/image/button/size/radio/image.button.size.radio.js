/**
 * 单选框
 * Created by GameJian on 2016/1/28.
 */
BI.ImageButtonSizeRadio = BI.inherit(BI.BasicButton, {

    _defaultConfig: function(){
        return BI.extend(BI.ImageButtonSizeRadio.superclass._defaultConfig.apply(this, arguments),{
            width: 65,
            height: 30,
            text: "",
            selected: false
        })
    },

    _init:function() {
        BI.ImageButtonSizeRadio.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.radio = BI.createWidget({
            type: "bi.radio",
            selected: o.selected
        });

        this.label = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            lgap: 5,
            rgap: 0,
            textHeight: o.height,
            height: o.height,
            text: o.text
        });

        this.radio.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(!self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            element: this,
            type: "bi.absolute",
            items: [{
                el: this.radio,
                left: 0,
                top: 8.5
            },{
                el: this.label,
                left: 13
            }]
        });
    },

    doClick: function () {
        BI.ImageButtonSizeRadio.superclass.doClick.apply(this, arguments);
        this.radio.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.ImageButtonSizeRadio.superclass.setSelected.apply(this, arguments);
        this.radio.setSelected(v);

    }
});
$.shortcut("bi.image_button_size_radio" , BI.ImageButtonSizeRadio);