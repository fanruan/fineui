# down_list_combo

## 多层下拉列表的下拉框

{% method %}
[source](https://jsfiddle.net/fineui/p0hykqo9/)

{% common %}
```javascript
BI.createWidget({
    type: 'bi.down_list_combo',
    element: '#wrapper',
    width: 300,
    items: [
                [{
                    el: {
                        text: "column 1111",
                        iconCls1: "check-mark-e-font",
                        value: 11
                    },
                    children: [{
                        text: "column 1.1",
                        value: 21,
                        cls: "dot-e-font",
                        selected: true
                    }, {
                        text: "column 1.222222222222222222222222222222222222",
                        cls: "dot-e-font",
                        value: 22,
                    }]
                }],
                [{
                    el: {
                        type: "bi.icon_text_icon_item",
                        text: "column 2",
                        iconCls1: "chart-type-e-font",
                        cls: "dot-e-font",
                        value: 12
                    },
                    disabled: true,
                    children: [{
                            type: "bi.icon_text_item",
                            cls: "dot-e-font",
                            height: 25,
                            text: "column 2.1",
                            value: 11
                           }, {
                            text: "column 2.2",
                            value: 12,
                            cls: "dot-e-font"
                          }]
                    }]
                ]
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|
| el    | 自定义下拉框trigger |  object |     |        |
| trigger    | 下拉列表的弹出方式 |  string |  click, hover   |    click    |
| direction    | 弹出列表和trigger的位置关系 |   string    |  top &#124; bottom &#124; left &#124; right &#124; top,left &#124; top,right &#124; bottom,left &#124; bottom,right   |   bottom     |
| adjustLength    | 弹出列表和trigger的距离 |  number |     |    0    |


##事件
| 事件    | 说明           |
| :------ |:------------- |
|BI.DownListCombo.EVENT_CHANGE| 点击一级节点触发 |
|BI.DownListCombo.EVENT_SON_VALUE_CHANGE| 点击二级节点触发 |
|BI.DownListCombo.EVENT_BEFORE_POPUPVIEW| 下拉列表弹出前触发 |

##具体配置方法见[Combo](../core/combination/bi.combo.md)



---