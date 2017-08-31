# bi.preview_table

### 用于表格预览，继承BI.Widget

{% method %}
[source](https://jsfiddle.net/fineui/po4s0hub/)

{% common %}
```javascript
var items = [[{
  text: "第一行第一列"
}, {
  text: "第一行第二列"
}, {
  text: "第一行第三列"
}]];

var header = [[{
  text: "表头1"
}, {
  text: "表头2"
}, {
  text: "表头3"
}]];

BI.createWidget({
  type: "bi.preview_table",
  header: header,
  element: 'body',
  columnSize: [100, "", 50],
  items: items
});
```

{% endmethod %}

##参数

| 参数            | 说明   | 类型           | 默认值   |
| ------------- | ---- | ------------ | ----- |
| isNeedFreeze  | 是否冻结 | bool         | false |
| freezeCols    | 冻结的列 | array        | []    |
| rowSize       | 行高   | array/number | null  |
| columnSize    | 列宽   | array        | []    |
| headerRowSize | 表头行高 | number       | 30    |
| header        | 表头内容 | array        | []    |
| items         | 子组件  | array        | []    |

## 方法
| 方法名                          | 说明               | 用法                                   |
| ---------------------------- | ---------------- | ------------------------------------ |
| resize                       | 调整表格             | resize()                             |
| setColumnSize                | 设置列宽             | setColumnSize(columnSize)            |
| getColumnSize                | 得到列宽             | getColumnSize()                      |
| getCalculateColumnSize       | 获得计算后的列宽         | getCalculateColumnSize()             |
| setHeaderColumnSize          | 设置表头的列宽          | setHeaderColumnSize(columnSize)      |
| setRegionColumnSize          | 设置列项之间的间隙        | setRegionColumnSize(columnSize)      |
| getRegionColumnSize          | 获得列项之间的间隙        | getRegionColumnSize()                |
| getCalculateRegionColumnSize | 获取计算后的列项之间的间隙    | getCalculateRegionColumnSize()       |
| getCalculateRegionRowSize    | 获取计算后的列项上下之间的间隙  | getCalculateRegionRowSize()          |
| getClientRegionColumnSize    | 获取浏览器中显示的列项之间的间隙 | getClientRegionColumnSize()          |
| getScrollRegionColumnSize    | 获取横向滚动条宽度        | getScrollRegionColumnSize()          |
| getScrollRegionRowSize       | 获取纵向滚动条宽度        | getScrollRegionRowSize()             |
| hasVerticalScroll            | 是否含有数值滚动条        | hasVerticalScroll()                  |
| setVerticalScroll            | 设置纵向滚动距离         | setVerticalScroll(scrollTop)         |
| setLeftHorizontalScroll      | 设置左到右横向滚动距离      | setLeftHorizontalScroll(scrollLeft)  |
| setRightHorizontalScroll     | 设置右往左横向滚动距离      | setRightHorizontalScroll(scrollLeft) |
| getVerticalScroll            | 获取纵向滚动距离         | getVerticalScroll()                  |
| getLeftHorizontalScroll      | 获取左到右横向滚动距离      | getLeftHorizontalScroll()            |
| getRightHorizontalScroll     | 获取右往左横向滚动距离      | getRightHorizontalScroll()           |
| getColumns                   | 获取列项             | getColumns()                         |
| resizeHeader                 | 调整表头             | resizeHeader()                       |
| attr                         | 设置属性             | attr(key, value)                     |
| populate                     | 增加行              | populate(rows)                       |
| destroy                      | 摧毁表              | destroy()                            |