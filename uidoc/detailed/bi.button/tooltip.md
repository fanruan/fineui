## 提示性信息

{% method %}
[source](https://jsfiddle.net/fineui/gn25yyrx/)

{% common %}
```javascript

var bubble = BI.createWidget({
    type: "bi.left",
    items: [{
        el: {
            type: 'bi.button',
            text: 'bubble测试',
            height: 30,
            handler: function () {
                BI.Bubbles.show("singleBubble1", "bubble测试", this);
                btns.push("singleBubble1");
            }
        }
    },{
        el: {
            type: 'bi.button',
            text: '隐藏所有 bubble',
            height: 30,
            cls: "layout-bg2",
            handler: function () {
                BI.each(btns, function (index, value) {
                    BI.Bubbles.hide(value);
                })
            }
        }
    }],
    hgap: 20,
    vgap: 20
});

var title = BI.createWidget({
    type: "bi.vertical",
    items: [{
        type: "bi.label",
        cls: "layout-bg1",
        height: 50,
        title: "title提示",
        text: "移上去有title提示",
        textAlign: "center"
    }],
    hgap: 20,
    vgap: 20
});

var toast = BI.createWidget({
    type: "bi.vertical",
    items: [{
        el: {
            type: 'bi.button',
            text: '简单Toast测试',
            height: 30,
            handler: function () {
                BI.Msg.toast("这是一条简单的数据");
            }
        }
    }],
    vgap: 20
});


BI.createWidget({
    type: "bi.horizontal_auto",
    element: "#wrapper",
    vgap: 20,
    hgap: 20,
    items: [bubble, title, toast]
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| hgap    | 效果相当于文本框左右padding值 |  number  |     |     10   |
| vgap    | 效果相当于文本框上下padding值 |  number  |  |      0  |
| lgap    | 效果相当于文本框left-padding值     |    number   |        |  0    |
| rgap    | 效果相当于文本框right-padding值     |    number  |       |  0    |
| tgap    |效果相当于文本框top-padding值     |    number   |  |  0    |
| bgap    |  效果相当于文本框bottom-padding值     |    number  |   |  0    |
| items | 子控件数组     |    array |  |  |
| width    |   宽度    |    number   |   |     |
| height    |   高度    |    number   |  |      |

------
--- ---


