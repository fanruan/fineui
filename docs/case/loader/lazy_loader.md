# bi.lazy_loader

### 懒加载loader

{% method %}
[source](https://jsfiddle.net/fineui/n710yphc/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.lazy_loader",
    width: 100,
    element: 'body',
    items: items,
});

```

{% endmethod %}



### 方法

| 方法名                   | 说明         | 参数    |
| --------------------- | ---------- | ----- |
| addItems              | 列表最后添加元素   | items |
| setValue              | 设置值        | data  |
| getVlaue              | 获得值        | —     |
| empty                 | 清空         | —     |
| populate              | 替换内容       | items |
| setNotSelectedValue   | 设置未选中值     | —     |
| getNotSelectedValue   | 获取未选中植     | —     |
| getAllButtons         | 获得所以根节点    | —     |
| getAllLeaves          | 获得所有叶节点    | —     |
| getSelectedButtons    | 获取选中的根节点   | —     |
| getNotSelectedButtons | 获取未选中的根节点  | —     |
| getIndexByValue       | 根据值获取索引    | value |
| getNodeById           | 根据id获取node | id    |
| getNodeByValue        | 根据值获取node  | value |

------