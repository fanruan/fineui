# bi.select_list

### 选择列表

{% method %}
[source](https://jsfiddle.net/fineui/c3azpxss/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.select_list",
    items: [{
        text: '1',
    }, {
        text: '2',
    }]
});

```

{% endmethod %}

### 参数

| 参数           | 说明              | 类型       | 默认值              |
| ------------ | --------------- | -------- | ---------------- |
| direction    | toolbar位置       | string   | BI.Direction.Top |
| onLoaded     | 加载完成的回调（测试了无效果） | function | BI.emptyFn       |
| items        | 子项              | array    | []               |
| itemsCreator | 元素创造器           | function | BI.emptyFn       |

### 方法

| 方法名                   | 说明            | 参数      |
| --------------------- | ------------- | ------- |
| setAllSelected        | 设置全选          | v: boolean |
| setToolBarVisible     | 设置toolbar是否可见 | b: boolean |
| isAllSelected         | 是否全选中         | —       |
| hasPrev               | 是否有上一页        | —       |
| hasNext               | 是否有下一页        | —       |
| prependItems          | 列表最前添加元素      | items   |
| addItems              | 列表最后添加元素      | items   |
| setValue              | 设置值           | data    |
| getVlaue              | 获得值           | —       |
| empty                 | 清空            | —       |
| populate              | 替换内容          | items   |
| resetHeight           | 重新设置高度        | h       |
| setNotSelectedValue   | 设置未选中值        | —       |
| getNotSelectedValue   | 获取未选中植        | —       |
| getAllButtons         | 获得所以根节点       | —       |
| getAllLeaves          | 获得所有叶节点       | —       |
| getSelectedButtons    | 获取选中的根节点      | —       |
| getNotSelectedButtons | 获取未选中的根节点     | —       |
| getIndexByValue       | 根据值获取索引       | value   |
| getNodeById           | 根据id获取node    | id      |
| getNodeByValue        | 根据值获取node     | value   |

------