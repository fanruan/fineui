# bi.table_view

### 表格展示控件

{% method %}
[source](https://jsfiddle.net/fineui/mbazb80a/)

{% common %}
```javascript
BI.createWidget({
  type: "bi.table_view",
  element: 'body',
  isNeedMerge: true,
  isNeedFreeze: true,
  freezeCols: [0, 1],
  mergeCols: [0, 1],
  columnSize: [100, 200, 300, 400, 500],
  items: [],
  header: []
});
```

{% endmethod %}

## 参数设置
| 参数               | 说明            | 类型                   | 默认值               |
| ---------------- | ------------- | -------------------- | ----------------- |
| isNeedResize     | 是否需要调整大小      | bool                 | false             |
| isNeedMerge      | 是否需要合并单元格     | bool                 | false             |
| mergeCols        | 合并的单元格列号      | array                | []                |
| mergeRule        | 合并规则, 默认相等时合并 | function(row1, row2) | 默认row1 = row2 时合并 |
| columnSize       | 单元格宽度集合       | array                | []                |
| headerRowSize    | 表头高度          | number               | 25                |
| footerRowSize    | 表尾高度          | number               | 25                |
| rowSize          | 普通单元格高度       | number               | 25                |
| regionColumnSize | 列项间的          | array                | false             |
| header           | 表头            | array                | []                |
| footer           | 表尾            | array                | false             |
| items            | 子组件           | array                | []                |

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
| populate                     | 增加行              | populate(rows)                       |
