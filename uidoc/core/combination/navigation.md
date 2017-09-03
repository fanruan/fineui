# bi.navigation

## 导航栏控件,[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/kau5pjm8/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.navigation",
  element: "body",
  height:30,
  tab: {
      height: 30,
      items: [{
          once: false,
          text: "后退",
          value: -1,
          cls: "mvc-button layout-bg3"
      },{
          once: false,
          text: "前进",
          value: 1,
          cls: "mvc-button layout-bg4"
      }]
  },
})



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| direction | 控件位置 | string | top,bottom,left,right,custom | "bottom"|
| single |  | boolean | true,false | true |
| defaultShowIndex | |boolean | true,false | true |
| tab | |boolean | true,false | true |
| defaultShowIndex |||||
| logic | | object | | {dynamic:true} |
| cardCreator | | function | | v |
| afterCardCreated | | | | — |
| afterCardShow | | | | — |



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| render | 渲染组件  | — |
| mounted | 挂载组件 | —|
| afterCardCreated | | v |
| afterCardShow | | v |
| setSelect | 设置选中的index | v |
| getSelect | 获取选中的index| —|
| getSelectedCard | | —|
| populate | 刷新列表 | items |
| setValue | 设置value值 | value |
| getValue | 获取被选中的值 |—|
| empty| 清空组件|—|
| destroy| 销毁组件|—|



---


