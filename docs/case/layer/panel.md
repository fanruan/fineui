# bi.panel

## 带有标题栏的panel，基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/3m1q3857/)

{% common %}
```javascript

BI.createWidget({
  element: "#wrapper",
  type: "bi.panel",
  title: "标题",
  titleButtons: [{
  	type: "bi.button",
    text: "+"
  }],
  el: this.button_group,
  logic: {
    dynamic: true
  }
});



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| title | 标题 | string | — | " "
| titleButton | 标题后的按钮组 | array | —| [ ]
| el | 开启panel的元素 | object | —|{ }|
| logic | 布局逻辑  | object |— | { dynamic:false}




## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
|  setTitle |设置标题| title





---


