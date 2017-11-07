# bi.button_tree

## 一组具有相同属性的元素集合,与button_group的区别是可以处理树状结构,基类[BI.ButtonGroup](/core/abstract/button_group.md)

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



---


