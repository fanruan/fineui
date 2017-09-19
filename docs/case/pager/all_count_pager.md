# bi.all_count_pager

### 有总页数和总行数的分页控件

{% method %}
[source](https://jsfiddle.net/fineui/cmtamo5L/)

{% common %}
```javascript

BI.createWidget({
    type: 'bi.all_count_pager',
    height: 30,
    pages: 10, //必选项
    curr: 1,
    count: 1,
});

```

{% endmethod %}

### 参数

| 参数     | 说明   | 类型     | 默认值  |
| ------ | ---- | ------ | ---- |
| height | 控件高度 | number | 30   |
| pages  | 总页数  | number | 1    |
| curr   | 当前页  | number | 1    |
| count  | 总行数  | number | 1    |



### 方法

| 方法名             | 说明       | 参数         |
| --------------- | -------- | ---------- |
| setAllPages     | 设置总页数    | v          |
| setValue        | 设置当前页码   | v          |
| setVPage        | 设置当前页码   | v          |
| setCount        | 设置计数     | count      |
| getCurrentPage  | 获取当前页码   | —          |
| hasPrev         | 是否有前一页   | —          |
| hasNext         | 是否有后一页   | —          |
| setPagerVisible | 设置页码是否可见 | true/false |
| populate        | 清空内容     | —          |

------