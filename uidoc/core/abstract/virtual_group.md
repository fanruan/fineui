# bi.virtual_group

## 一组具有相同属性的元素集合,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/gesh31xg/)

{% common %}
```javascript

BI.createWidget({
  element: "#wrapper",
  type: "bi.virtual_group",
  width: 500,
  height: 300,
  chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
  layouts: [{
      type: "bi.vertical"
  }, {
      type: "bi.center_adapt",
  }],
  items:[]
})
```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| items | 子组件数组 | array |   | [ ] |
| layouts | 布局 | array |   | [{type: "bi.center",hgap: 0,vgap: 0}] |



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| setValue | 设置value值 | value,可以是单个值也可以是个数组 |
| getValue | 获取被选中的值 |—|
| prependItems | 内部前插入 | items |
| addItems | 内部后插入 | items |
| populate | 刷新列表 | items |
| render | 渲染列表 |  |



---


