# bi.switcher

## 切换显示或隐藏面板,[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/pdo5s8pq/)

{% common %}
```javascript

BI.createWidget({
  element: "#wrapper",
  type: "bi.tab",
  tab: {
    type: "bi.button_group",
    height: 30,
    items: [{
      text: "Tab1",
      value: 1,
      width: 50
    }, {
      text: "Tab2",
      value: 2,
      width: 50
    }]
  },
  cardCreator: function(v) {
    switch (v) {
      case 1:
        return BI.createWidget({
          type: "bi.label",
          cls: "bi-card",
          text: "面板1"
        })
      case 2:
        return BI.createWidget({
          type: "bi.label",
          cls: "bi-card",
          text: "面板2"
        })
    }
  }
})




```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| direction | 控件位置 | string | top,bottom,left,right,custom | "bottom"|
| single | 是否为单页 | boolean | true,false | false |
| defaultShowIndex | 是否默认显示tab页 | boolean | true,false | false |
| tab | tab标签页 | object | — | { } |
| logic | 布局逻辑 | object | — | {dynamic:false} |
| cardCreator | 面板构造器| function | — | function (v) {return BI.createWidget();} |

## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| render | 渲染组件  | — |
| mounted | 挂载组件 | —|
| removeTab | 移除tab面板页 | cardname |
| getTab | 获取tab面板页 | v |
| setSelect | 设置选中的index | v |
| getSelect | 获取选中的index| —|
| getSelectedTab | 获取选中的tab面板页 | —|
| populate | 刷新列表 | items |
| setValue | 设置value值 | value |
| getValue | 获取被选中的值 |—|
| empty| 清空组件|—|
| destroy| 销毁组件|—|




---


