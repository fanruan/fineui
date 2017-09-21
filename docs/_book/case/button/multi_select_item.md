# bi.multi_select_item

## 复选框item,基类[BI.BasicButton](/core/basic_button.md)

{% method %}
[source](https://jsfiddle.net/fineui/0z1fud88/)

{% common %}
```javascript

BI.createWidget({
    type: 'bi.vertical',
    element: "#wrapper",
    items: [{
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
| height | 高度 | number | — | 30
| logic | 布局逻辑 | object |  — | {dynamic:false} |


 


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| setSelected| 设置选中值| v |
| doRedMark | 标红 |—|
| unRedMark | 取消标红 | — |
| doClick | 点击事件| —





---


