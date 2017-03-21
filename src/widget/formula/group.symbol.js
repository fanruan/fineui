/**
 * Created by roy on 15/9/29.
 */
/**
 * Created by roy on 15/9/1.
 */
BI.SymbolGroup = BI.inherit(BI.Widget, {
    constants: {
        hgap: 7.5,
        textWidth: 14,
        textHeight: 17
    },
    _defaultConfig: function () {
        return BI.extend(BI.SymbolGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-symbol-group"
        })
    },
    _init: function () {
        BI.SymbolGroup.superclass._init.apply(this, arguments)
        var self = this, c = this.constants;

        var items = [{
            text: "+",
            value: "+"
        }, {
            text: "-",
            value: "-"
        }, {
            text: "*",
            value: "*"
        }, {
            text: "/",
            value: "/"
        }, {
            text: "(",
            value: "("
        }, {
            text: ")",
            value: ")"
        }];

        this.symbolgroup = BI.createWidget({
            type: "bi.button_group",
            element: self,
            chooseType:-1,
            items: BI.createItems(items, {
                type: "bi.text_button",
                forceNotSelected: true,
                once: false,
                textWidth: c.textWidth,
                textHeight: c.textHeight,
                cls: "symbol-button"
            }),
            layouts: [{
                type: "bi.left_vertical_adapt",
                hgap: c.hgap
            }]
        });

        this.symbolgroup.on(BI.ButtonGroup.EVENT_CHANGE,function(v){
            self.fireEvent(BI.SymbolGroup.EVENT_CHANGE,v)
        })
    }
});
BI.SymbolGroup.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.symbol_group", BI.SymbolGroup);