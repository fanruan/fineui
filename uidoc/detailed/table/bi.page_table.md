# bi.page_table

### 分页表格

{% method %}
[source](https://jsfiddle.net/fineui/4egug10x/)

{% common %}
```javascript
BI.createWidget({
  type: "bi.page_table",
  element: "body",
  columnSize: [200,200],
  items: [],
  pager: {
    horizontal : {},
    vertical: {}
  } 
});
```

{% endmethod %}

## 参数设置
| 参数                      | 二级参数       | 三级参数      | 说明                 | 类型                   | 默认值               |
| ----------------------- | ---------- | --------- | ------------------ | -------------------- | ----------------- |
| pager                   |            |           | 分页选项               | object               | —                 |
|                         | horizontal |           | 水平分页选项             | object               | —                 |
|                         |            | pages     | 显示总页数              | bool                 | false             |
|                         |            | curr      | 当前页                | number               | 1                 |
|                         |            | hasPrev   | 判断是否有前一页的函数        | function             | BI.emptyFn        |
|                         |            | hasNext   | 是否有下一页             | function             | BI.emptyFn        |
|                         |            | firstPage | 第一页                | number               | 1                 |
|                         |            | lastPage  | 最后一页               | number/function      | BI.emptyFn        |
|                         | vertical   |           | 纵向分页，参数与horizontal | object               | —                 |
| itemsCreator            |            |           | 元素创造器              | function             | BI.emptyFn        |
| isNeedFreeze            |            |           | 是否需要冻结表头           | bool                 | false             |
| freezeCols              |            |           | 冻结的列               | array                | []                |
| isNeedMerge             |            |           | 是否需要合并单元格          | bool                 | false             |
| mergeCols               |            |           | 合并的单元格列号           | array                | []                |
| mergeRule               |            |           | 合并规则, 默认相等时合并      | function(row1, row2) | 默认row1 = row2 时合并 |
| columnSize              |            |           | 单元格宽度集合            | array                | []                |
| minColumnSize           |            |           | 最小列宽               | array                | []                |
| maxColumnSize           |            |           | 最大列宽               | array                | []                |
| headerRowSize           |            |           | 表头高度               | number               | 25                |
| rowSize                 |            |           | 普通单元格高度            | number               | 25                |
| regionColumnSize        |            |           | 列项间的               | array                | []                |
| headerCellStyleGetter   |            |           |                    | function             | BI.emptyFn        |
| summaryCellStyleGetter  |            |           |                    | function             | BI.emptyFn        |
| sequenceCellStyleGetter |            |           |                    | function             | BI.emptyFn        |
| header                  |            |           | 表头                 | array                | []                |
| items                   |            |           | 子组件                | array                | []                |
| crossHeader             |            |           | 交叉表头               | array                | []                |
| crossItems              |            |           | 交叉项                | array                | []                |



## 方法
| 方法名                      | 说明          | 回调参数               |
| ------------------------ | ----------- | ------------------ |
| setHPage                 | 设置水平页数      | v: 页码              |
| setVpage                 | 设置纵向页数      | v: 页码              |
| getHPage                 | 获得水平页数      | —                  |
| getVPage                 | 获得垂直页数      | —                  |
| setWidth                 | 设置宽度        | width: 宽度          |
| setHeight                | 设置高度        | height: 高度         |
| setColumnSize            | 设置列宽        | columnSize: 列宽数组   |
| getColumnSize            | 得到列宽        | —                  |
| setRegionColumnSize      | 设置列项之间的间隙   | columnSize: 列宽数组   |
| getRegionColumnSize      | 获得列项之间的间隙   | —                  |
| setVerticalScroll        | 设置纵向滚动距离    | scrollTop: 纵向滚动距离  |
| setLeftHorizontalScroll  | 设置左到右横向滚动距离 | scrollLeft: 横向滚动距离 |
| setRightHorizontalScroll | 设置右往左横向滚动距离 | scrollLeft: 横向滚动距离 |
| getVerticalScroll        | 获取纵向滚动距离    | —                  |
| getLeftHorizontalScroll  | 获取左到右横向滚动距离 | —                  |
| getRightHorizontalScroll | 获取右往左横向滚动距离 | —                  |
| attr                     | 设置属性        | key: 键   value: 值  |
| populate                 | 增加          | —                  |
| destroy                  | 摧毁表         | —                  |

