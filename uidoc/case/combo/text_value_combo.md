# text_value_combo

## 单选combo, 基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/72xwcdee/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.text_value_combo",
  text: "initial value",
  element: "#wrapper",
  width: 300,
  items: [{
    text: "MVC-1",
    value: 1
  }, {
    text: "MVC-2",
    value: 2
  }, {
    text: "MVC-3",
    value: 3
  }]
})



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| height | 高度 | number | — | 24
| items | 子items | array | — | [ ]
| text | trigger初始文本内容 | string | — | " " |
| chooseType | 选择类型 | const |参考button_group | BI.ButtonGroup.CHOOSE_TYPE_SINGLE |



## 对外方法
| 名称     | 说明                           |  回调参数
| :------ |:-------------                  | :-----





---