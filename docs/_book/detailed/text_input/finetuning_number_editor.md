# finetuning_number_editor

## 数值微调器

{% method %}
[source](https://jsfiddle.net/fineui/52dhwtfz/)

{% common %}
```javascript
BI.createWidget({
    type: 'bi.fine_tuning_number_editor',
    element: '#wrapper',
    width: 300
});
```

{% endmethod %}

## 参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|
| value    | 编辑框中的值，-1表示自动 |  number |     |     -1   |



## 事件
| 事件    | 说明           |
| :------ |:-------------  |
|BI.FineTuningNumberEditor.EVENT_CONFIRM| 点击增加/减少按钮或者编辑框确定时触发 |



---