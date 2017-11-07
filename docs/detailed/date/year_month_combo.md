# year_month_combo

##年月选择下拉框

{% method %}
[source](https://jsfiddle.net/fineui/ehvjj3xt/)

{% common %}
```javascript
BI.createWidget({
    type: "bi.year_month_combo",
    width: 300
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|
| yearBehaviors |自定义年份选择的行为(详见[button_group](../../core/abstract/button_group.md))  | object| —| { } |
| monthBehaviors |自定义年份选择的行为(详见[button_group](../../core/abstract/button_group.md))  | object|— |  { }|


##事件
| 事件    |  说明  |
| :------ |:------------- |
| BI.YearMonthCombo.EVENT_BEFORE_POPUPVIEW |   弹出框弹出前触发   |
| BI.YearMonthCombo.EVENT_CONFIRM|   点击确认触发   |


---