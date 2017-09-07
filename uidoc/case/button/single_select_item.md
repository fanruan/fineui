# bi.single_select_item

## 可以点击的label,基类[BI.BasicButton](/core/basic_button.md)

{% method %}
[source](https://jsfiddle.net/fineui/19qqcej4/)

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
        type: "bi.single_select_item",
        text: "复选项"
    }]
});

```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| height | 高度 | number | — | 25
| hgap | 效果相当于文本框左右padding值 |number | —| 10 |
|textAlign	|文本对齐方式	|string	|left,center,right	|"left"

 


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| setSelected| 设置选中值| v |
| doRedMark | 标红 |—|
| unRedMark | 取消标红 | — |
| doClick | 点击事件| —






---


