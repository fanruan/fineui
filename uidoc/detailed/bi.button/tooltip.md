## 提示性信息

{% method %}
[source](https://jsfiddle.net/fineui/gn25yyrx/)

{% common %}
```javascript
var toast = BI.createWidget({
    type: "bi.vertical",
    element: "#wrapper",
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

```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| hgap    | 效果相当于文本框左右padding值 |  number  |   —  |     10   |
| vgap    | 效果相当于文本框上下padding值 |  number  | — |      0  |
| lgap    | 效果相当于文本框left-padding值     |    number   |  —      |  0    |
| rgap    | 效果相当于文本框right-padding值     |    number  |   —    |  0    |
| tgap    |效果相当于文本框top-padding值     |    number   | — |  0    |
| bgap    |  效果相当于文本框bottom-padding值     |    number  | —  |  0    |
| items | 子控件数组     |    array | — | [ ] |
| width    |   宽度    |    number   |  — |  —   |
| height    |   高度    |    number   | — |    —  |



---


