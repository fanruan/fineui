# bi.resizable_table

### 可调整列宽的grid表格，继承BI.Widget

{% method %}
[source](https://jsfiddle.net/fineui/0e7p2ezc/)

{% common %}
```javascript
BI.createWidget({
  type: "bi.resizable_table",
  element: "body",
  columnSize: [200,200],
  items: [
    [{
      type: "bi.label",
      cls: "layout-bg1",
      text: "第一行第一列"
    }, {
      type: "bi.label",
      cls: "layout-bg2",
      text: "第一行第二列"
    }],
    [{
      type: "bi.label",
      cls: "layout-bg3",
      text: "第二行第一列"
    }, {
      type: "bi.label",
      cls: "layout-bg4",
      text: "第二行第二列"
    }]
  ] 
});
```

{% endmethod %}

## 参数设置
| 参数               | 说明        | 类型     | 默认值   |
| ---------------- | --------- | ------ | ----- |
| isNeedFreeze     | 是否需要冻结列   | bool   | false |
| freezeCols       | 冻结的列      | array  | []    |
| isNeedResize     | 是否需要调整大小  | bool   | false |
| isResizeAdapt    | 是否调整时自适应  | bool   | true  |
| isNeedMerge      | 是否需要合并单元格 | bool   | false |
| mergeCols        | 合并的单元格列号  | array  | []    |
| columnSize       | 单元格宽度集合   | array  | []    |
| minColumnSize    | 最小列宽      | array  | []    |
| maxColumnSize    | 最大列宽      | array  | []    |
| headerRowSize    | 表头高度      | number | 25    |
| rowSize          | 普通单元格高度   | number | 25    |
| header           | 表头        | array  | []    |
| regionColumnSize | 列项间的      | array  | []    |
| items            | 子组件       | array  | []    |

## 方法
| 方法名                      | 说明          | 用法                                   |
| ------------------------ | ----------- | ------------------------------------ |
| setWidth                 | 设置宽度        | setWidth()                           |
| setHeight                | 设置高度        | setHeight()                          |
| setColumnSize            | 设置列宽        | setColumnSize(columnSize)            |
| getColumnSize            | 得到列宽        | getColumnSize()                      |
| setRegionColumnSize      | 设置列项之间的间隙   | setRegionColumnSize(columnSize)      |
| getRegionColumnSize      | 获得列项之间的间隙   | getRegionColumnSize()                |
| setVerticalScroll        | 设置纵向滚动距离    | setVerticalScroll(scrollTop)         |
| setLeftHorizontalScroll  | 设置左到右横向滚动距离 | setLeftHorizontalScroll(scrollLeft)  |
| setRightHorizontalScroll | 设置右往左横向滚动距离 | setRightHorizontalScroll(scrollLeft) |
| getVerticalScroll        | 获取纵向滚动距离    | getVerticalScroll()                  |
| getLeftHorizontalScroll  | 获取左到右横向滚动距离 | getLeftHorizontalScroll()            |
| getRightHorizontalScroll | 获取右往左横向滚动距离 | getRightHorizontalScroll()           |
| attr                     | 设置属性        | attr(key, value)                     |
| populate                 | 增加行         | populate(rows)                       |
| restore                  | 保存表         | restore()                            |