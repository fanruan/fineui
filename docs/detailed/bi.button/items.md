## 各种items

{% method %}
[source](https://jsfiddle.net/fineui/jyo0qdwL/)

{% common %}
```javascript

BI.createWidget({
    type: 'bi.vertical',
    element: "#wrapper",
    items: [{
        type: "bi.label",
        height: 30,
        text: "单选item"
    }, {
        type: "bi.single_select_item",
        text: "单选项"
    }, {
        type: "bi.label",
        height: 30,
        text: "复选item"
    }, {
        type: "bi.multi_select_item",
        text: "复选项"
    }]
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| hgap    | 效果相当于文本框左右padding值，如果clear属性为true,该属性值置0 |  number  |  —   |     10   |
| vgap    | 效果相当于文本框上下padding值 |  number  |  — |      0  |
| lgap    | 效果相当于文本框left-padding值     |    number   |   —     |  0    |
| rgap    | 效果相当于文本框right-padding值     |    number  |    —   |  0    |
| tgap    |效果相当于文本框top-padding值     |    number   | — |  0    |
| bgap    |  效果相当于文本框bottom-padding值     |    number  | —  |  0    |
| items | 子控件数组     |    array | — | [ ] |
| width    |   宽度    |    number   |  — |  —   |
| height    |   高度    |    number   | — |  —    |



---


