# year_combo

## 年份选择下拉框

{% method %}
[source](https://jsfiddle.net/fineui/3na3125L/)

{% common %}
```javascript
BI.createWidget({
    type: 'bi.year_combo',
    element: '#wrapper',
    width: 300
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|
| behaviors    | 自定义下拉列表中item项的行为，如高亮，标红等(详见[button_group](../core/abstract/button_group.md)) |  object |     |     {}   |
| min    | 限定可选日期的下限 |  string  |  |      '1900-01-01'  |
| max    | 限定可选日期的上限     |    string   |        |  '2099-12-31'    |

--- ---

##事件
| 事件    | 说明           |
|BI.YearCombo.EVENT_CONFIRM| 选中日期或者退出编辑状态触发 |
|BI.YearCombo.EVENT_BEFORE_POPUPVIEW| 选中日期或者退出编辑状态触发 |

