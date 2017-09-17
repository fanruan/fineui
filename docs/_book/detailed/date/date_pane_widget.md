# date_pane_widget

##日期选择下拉框的弹出面板

{% method %}
[source](https://jsfiddle.net/fineui/rL9005u6/)

{% common %}
```javascript
BI.createWidget({
    type: "bi.date_pane_widget",
    element: "#wrapper",
    width: 300
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|
| min    | 限定可选日期的下限 |  string  |  |      '1900-01-01'  |
| max    | 限定可选日期的上限     |    string   |        |  '2099-12-31'    |
| selectedTime    | 选中的初始年月     |    obj({year: y, month: m})   |   —     |  —    |


---