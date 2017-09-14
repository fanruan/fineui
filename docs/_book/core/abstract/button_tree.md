# bi.button_tree

## 一组具有相同属性的元素集合,基类[BI.ButtonGroup](/core/abstract/button_group.md)

{% method %}
[source](https://jsfiddle.net/fineui/pgwpw4n9/)

{% common %}
```javascript

BI.createWidget({
  element: "#wrapper",
  type: "bi.button_tree",
  chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
  layouts: [{
      type: "bi.vertical"
  }],
  items: [{
      type: "bi.label",
      text: "0",
      value: "label1",
      height:50,
      vgap:10
  }]
})
```

{% endmethod %}

## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| setNotSelectedValue| 设置未被选中的值 | value,可以是单个值也可以是个数组|
| setEnabledValue | 设置value值可用| value,可以是单个值也可以是个数组 |
| setValue | 设置value值 | value,可以是单个值也可以是个数组 |
| getNotSelectedValue | 获取没有被选中的值 | —|
| getValue | 获取被选中的值 |—|
| getAllButtons | 获取所有button |—|
| getAllLeaves | 获取所有的叶子节点 | —|
| getSelectedButtons | 获取所有被选中的元素 | —|
| getNotSelectedButtons | 获取所有未被选中的元素 | —|
| getIndexByValue | 根据value值获取value在数组中的索引 | value|
| getNodeById | 根据id获取节点 | id |
| getNodeByValue | 根据value值获取节点 | value |



---


