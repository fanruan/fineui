# bi.static_combo

## 单选combo,trigger显示项不会改变 基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/kn64gfzn/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.static_combo",
    element: "#wrapper",
    text: "Value 不变",
    items: [{
      text: "1",
      value: 1
    }, {
      text: "2",
      value: 2
    }, {
      text: "3",
      value: 3
    }]
  });



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| height | 高度 | number | — | 24
| el | 自定义下拉框trigger| object | —|{ } |
| items | 子组件 | array | — | [ ]
| text | 文本内容 | string | — | " " |
| chooseType | 选择类型 | const |参考button_group | BI.ButtonGroup.CHOOSE_TYPE_SINGLE |
 


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| setValue| 设置value值|—|
| getValue| 获取value值|—|
| populate | 刷新列表 | items |





---


