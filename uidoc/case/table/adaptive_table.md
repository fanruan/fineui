# bi.adaptive_table

### 自适应宽度的表格

{% method %}
[source](https://jsfiddle.net/fineui/pbgnjeg0/)

{% common %}
```javascript
BI.createWidget({
  type: "bi.adaptive_table",
  element: 'body',
  width: 600,
  height: 500,
  isResizeAdapt: true,
  isNeedResize: true,
  isNeedFreeze: true,
  freezeCols: [0, 1],
  columnSize: [50,50,200,250,400],
  header: [],
  items: [],
});
```

{% endmethod %}

## 参数设置
| 参数               | 说明            | 类型                   | 默认值               |
| ---------------- | ------------- | -------------------- | ----------------- |
| isNeedResize     | 是否可改变列大小      | boolean                 | true              |
| isNeedFreeze     | 是否需要冻结表头      | boolean                 | false             |
| freezeCols       | 冻结的列          | array                | []                |
| isNeedMerge      | 是否需要合并单元格     | boolean                 | false             |
| mergeCols        | 合并的单元格列号      | array                | []                |
| mergeRule        | 合并规则, 默认相等时合并 | function(row1, row2) | 默认row1 = row2 时合并 |
| columnSize       | 单元格宽度集合       | array                | []                |
| minColumnSize    | 最小列宽          | array                | []                |
| maxColumnSize    | 最大列宽          | array                | []                |
| headerRowSize    | 表头高度          | number               | 25                |
| rowSize          | 普通单元格高度       | number               | 25                |
| regionColumnSize | 列项间的          | array                | []                |
| header           | 表头            | array                | []                |
| items            | 子组件           | array                | []                |
| crossHeader      | 交叉表头          | array                | []                |
| crossItems       | 交叉项           | array                | []                |



## 方法
| 方法名                      | 说明          | 参数               |
| ------------------------ | ----------- | ------------------ |
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
| restore                  | 存储          | —                  |
| populate                 | 增加项         | items: array       |
| destroy                  | 摧毁表         | —                  |

------