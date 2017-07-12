/**
 * Created by Dailer on 2017/7/11.
 */
Demo.ClearEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var editor;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.shelter_editor",
                cls: "editor",
                ref:function(_ref){
                    editor=_ref;
                },
                width: 300,
                watermark: "这个是带标记的"
            },{
                type:"bi.button",
                text:"setValue",
                width:300,
                handler:function(){
                    editor.setValue("凛冬将至");
                }
            },{
                type:"bi.button",
                text:"doHighLight",
                width:300,
                handler:function(){
                    editor.doHighLight();
                    console.log(editor.getState());
                }
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.shelter_editor", Demo.ClearEditor);