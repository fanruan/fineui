# month_combo

## 月份选择下拉框

{% method %}
[source](https://jsfiddle.net/fineui/u4u04ntn/)

{% common %}
```javascript
BI.createWidget({
    type: 'bi.month_combo',
    element: '#wrapper',
    width: 300
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|
| behaviors    | 自定义下拉列表中item项的行为，如高亮，标红等(详见[button_group](../core/abstract/button_group.md)) |  object |     |     {}   |

--- ---

##事件
| 事件    | 说明           |
|BI.MonthCombo.EVENT_CONFIRM| 选中日期或者退出编辑状态触发 |
|BI.MonthCombo.EVENT_BEFORE_POPUPVIEW| 选中日期或者退出编辑状态触发 |

