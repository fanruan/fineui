# bi.popup_view

## 下拉框弹出层, zIndex在1000w,[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/x95pg143/)

{% common %}
```javascript

BI.createWidget({
  element: "#wrapper",
  type: "bi.popup_view",
  el: {
    type: "bi.button_group",
    items: [{
      text: "aaa",
      value: "aaa"
    }, {
      text: "bbb",
      value: "bbb"
    }],
    layouts: [{
      type: "bi.vertical"
    }]
  }
})



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| maxWidth | 弹出层最大宽度 | number/string | — | "auto" |
| minWidth | 弹出层最小宽度 | number | — | 100 |
| maxHeight | 弹出层最大高度 | number/string | — | — |
| minHeight | 弹出层最小高度 | number | — | 25 |
| hgap    | 效果相当于容器左右padding值    |    number  | — |  0  |
| vgap    | 效果相当于容器上下padding值    |    number  |  —|  0  |
| lgap    | 效果相当于容器left-padding值   |    number  | — |  0  |
| rgap    | 效果相当于容器right-padding值  |    number  |  —|  0  |
| tgap    | 效果相当于容器top-padding值    |    number  |  —|  0  |
| bgap    | 效果相当于容器bottom-padding值 |    number  | — |  0  |
| direction| 工具栏的方向| const | 参考button_group | BI.Direction.Top |
| stopEvent | 是否停止mousedown、mouseup事件 | boolean | true,false | false |
| stopPropagation | 是否停止mousedown、mouseup向上冒泡 | boolean | true,false | false |
| tabs | 导航栏 | array | — | [] |
| logic | 布局逻辑| object | — | {dynamic:true} |
| tools | 自定义工具栏 |boolean | true,false | false |
| buttons | toolbar栏 | array | — | [] |
| el | 子组件 | object | — |{ type: "bi.button_group",items: [], chooseType: 0,behaviors: {},layouts: [{type: "bi.vertical"}]} |


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| populate | 刷新列表 | items |
| resetWidth | 重置宽度 | width |
| resetHeight |  重置高度  | height|
| setValue | 设置value 值 | value |
| getValue| 获取value值 | —|
| setZindex | 设置z-index| z-index | 
| getView | 获取弹出层 | —|





---


