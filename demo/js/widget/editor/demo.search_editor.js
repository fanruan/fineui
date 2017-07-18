/**
 * Created by Dailer on 2017/7/11.
 */
Demo.SearchEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.search_editor",
                width: 300,
                watermark:"添加合法性判断",
                errorText: "长度必须大于4",
                validationChecker:function(){
                    return this.getValue().length > 4 ? true : false
                }
            },{
                type: "bi.small_search_editor",
                width: 300,
                watermark:"这个是 small,小一号"
            }],
            vgap:20
        }
    }
})

BI.shortcut("demo.search_editor", Demo.SearchEditor);