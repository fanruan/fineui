# bi.button_group

## 一组具有相同属性的元素集合,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/te0nLap1/)

{% common %}
```javascript

BI.createWidget({
	element: "#wrapper",
    type: "bi.button_group",
    chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
    layouts: [{
      type: "bi.vertical"
    }],
    items: [{
      el: {
        type: "bi.label",
        text: "button_group"
      },
      height: 50,
    }]
})

```

{% endmethod %}

## API
##### 基础属性
###### chooseType可选值为 CHOOSE_TYPE_SINGLE,CHOOSE_TYPE_MULTI,CHOOSE_TYPE_ALL,CHOOSE_TYPE_NONE,CHOOSE_TYPE_DEFAULT
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| behaviors | 自定义列表中item项的行为，如高亮，标红等 |object | — |{ }|
| items | 子组件数组 | array | —  | [ ] |
| chooseType | 选择类型 | const | 见上| BI.ButtonGroup.CHOOSE_TYPE_SINGLE |
| layouts | 布局 | array | —  | [{type: "bi.center",hgap: 0,vgap: 0}] |

## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| doBehavior |  自定义列表中item项的行为，如高亮，标红等 | — |
| prependItems | 内部前插入 | items |
| addItems | 内部后插入 | items |
| removeItemAt | 移除指定索引处的item | indexs |
| removeItems | 移除制定元素 | values |
| populate | 刷新列表 | items |
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
| empty| 清空组件|—|
| destroy| 销毁组件|—|


---


