# custom_date_time

## 日期选择下拉框（可以选择时分秒）

{% method %}
[source](https://jsfiddle.net/fineui/2d9dcxov/)

{% common %}
```javascript
BI.createWidget({
    type: "bi.custom_date_time_combo",
    element: "#wrapper",
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----


##事件
| 事件    |  说明  |
| :------ |:------------- |
| BI.CustomDateTimeCombo.EVENT_CANCEL|   点击取消触发   |
| BI.CustomDateTimeCombo.EVENT_CONFIRM|   点击确认触发   |

---
