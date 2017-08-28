/**
 * Created by Dailer on 2017/7/11.
 */
Demo.AdaptEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },



    //这东西好奇怪,不支持设置宽度,那么渲染出来宽度几乎没有,无奈之下只能假装给他个默认值了
    beforeMount: function () {
        this.refs.setValue("Winter is coming !")
    },

    render: function () {
        var self = this;
        var editor = BI.createWidget({
            type: "bi.adapt_editor",
            cls: "layout-bg5",
            ref: function (_ref) {
                self.refs = _ref;
            }
        })

        var text=["You know nothing! Jon Snow","A Lannister always pays his debts.","Power is a curious thing."]

        return {
            type: "bi.horizontal_auto",
            items: [{
                el: editor
            }, {
                type: "bi.button",
                text: "为了展示长度真的是可变的,每点一下就换一行字",
                handler: function () {
                    var temp=text.shift();
                    editor.setValue(temp);
                    text.push(temp);
                }
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.adapt_editor", Demo.AdaptEditor);