# bi.navigation

## 导航栏控件,[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/ubsren48/)

{% common %}
```javascript


BI.createWidget({
  element: "#wrapper",
  type: "bi.navigation",
  tab: {
    height: 30,
    items: [{
      once: false,
      text: "后退",
      value: -1
    }, {
      once: false,
      text: "前进",
      value: 1
    }]
  },
  cardCreator: function(v) {
    return BI.createWidget({
      type: "bi.label",
      cls: "layout-bg" + BI.random(1, 8),
      text: "第" + v + "页"
    })
  }
})




```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| direction | 控件位置 | string | top,bottom,left,right,custom | "bottom"|
| single | 是否为单页 | boolean | true,false | true |
| defaultShowIndex | 是否默认显示 |boolean | true,false | true |
| tab | tab页元素 | boolean | true,false | true |
| logic | 布局逻辑 | object | — | {dynamic:true} |
| cardCreator | 面板构造器 | function | — | v |
| afterCardCreated | 面板构造之后 | function | — | — |
| afterCardShow | 面板显示之后 | function | —| — |



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| render | 渲染组件  | — |
| mounted | 挂载组件 | —|
| afterCardCreated | 创建卡导航页页之后 | v |
| afterCardShow | 导航页展示之后 | v |
| setSelect | 设置选中的index | v |
| getSelect | 获取选中的index| —|
| getSelectedCard | 获取选中的导航页| —|
| populate | 刷新列表 | items |
| setValue | 设置value值 | value |
| getValue | 获取被选中的值 |—|
| empty| 清空组件|—|
| destroy| 销毁组件|—|



---


