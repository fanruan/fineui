# year_quarter_combo

##年季度选择下拉框

{% method %}
[source](https://jsfiddle.net/fineui/xe6Lt6mo/)

{% common %}
```javascript
BI.createWidget({
    type: "bi.year_quarter_combo",
    width: 300
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|
| yearBehaviors |自定义年份选择的行为(详见[button_group](../../core/abstract/button_group.md))  | object| |  |
| monthBehaviors |自定义年份选择的行为(详见[button_group](../../core/abstract/button_group.md))  | object| —|{ } |



##事件
| 事件    |  说明  |
| :------ |:------------- |
| BI.YearQuarterCombo.EVENT_BEFORE_POPUPVIEW |   弹出框弹出前触发   |
| BI.YearQuarterCombo.EVENT_CONFIRM|   点击确认触发   |


---