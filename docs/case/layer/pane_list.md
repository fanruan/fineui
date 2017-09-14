# bi.list_pane

## list面板，基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/7Lv8q9p9/)

{% common %}
```javascript

BI.createWidget({
  type: 'bi.list_pane',
  element: "#wrapper",
  cls: "bi-border",
  items: []
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| items | 列表 | array | — | [ ]
| itemsCreator | 列表创建器| function | — | —
| hasNext | 是否有下一页 | function | —| —
| onLoad | 正在加载 | function | —| — 
| el | 开启panel的元素 | object | —|{type: "bi.button_group" }|
| logic | 布局逻辑 | object |— | { dynamic:true}
| hgap    | 效果相当于容器左右padding值    |    number  | — |  0  |
| vgap    | 效果相当于容器上下padding值    |    number  |  —|  0  |
| lgap    | 效果相当于容器left-padding值   |    number  |  —|  0  |
| rgap    | 效果相当于容器right-padding值  |    number  | — |  0  |
| tgap    | 效果相当于容器top-padding值    |    number  | — |  0  |
| bgap    | 效果相当于容器bottom-padding值 |    number  | — |  0  |



 


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| prependItems | 内部前插入 | items |
| addItems | 内部后插入 | items |
| removeItemAt | 移除指定索引处的item | indexs |
| populate | 刷新列表 | items |
| setNotSelectedValue| 设置未被选中的值 | value,可以是单个值也可以是个数组|
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
| hasPrev| 是否有上一页|—|
| hasNext |  是否有下一页 | —






---


