# bi.collection_table

### 基本的表格 继承BI.Widget

{% method %}
[source](https://jsfiddle.net/fineui/x2zxfzhp/)

{% common %}
```javascript
BI.createWidget({
  type: "bi.collection_table",
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
| 参数               | 说明            | 类型                   | 默认值               |
| ---------------- | ------------- | -------------------- | ----------------- |
| isNeedFreeze     | 是否冻结列         | boolean              | false             |
| freezeCols       | 冻结的列          | array                | []                |
| isNeedMerge      | 是否需要合并单元格     | boolean              | false             |
| mergeCols        | 合并的单元格列号      | array                | []                |
| mergeRule        | 合并规则, 默认相等时合并 | function(row1, row2) | 默认row1 = row2 时合并 |
| columnSize       | 单元格宽度集合       | array                | []                |
| headerRowSize    | 表头高度          | number               | 25                |
| rowSize          | 普通单元格高度       | number               | 25                |
| regionColumnSize | 列项间的          | array                | []                |
| items            | 子组件           | array                | []                |

## 方法
| 方法名                       | 说明          | 参数         |
| ------------------------- | ----------- | ---------- |
| setWidth                  | 设置宽度        | width      |
| setHeight                 | 设置高度        | height     |
| setColumnSize             | 设置列宽        | columnSize |
| getColumnSize             | 得到列宽        | —          |
| setRegionColumnSize       | 设置列项之间的间隙   | columnSize |
| getRegionColumnSize       | 获得列项之间的间隙   | —          |
| getScrollRegionColumnSize | 获取横向滚动条宽度   | —          |
| setVerticalScroll         | 设置纵向滚动距离    | scrollTop  |
| setLeftHorizontalScroll   | 设置左到右横向滚动距离 | scrollLeft |
| setRightHorizontalScroll  | 设置右往左横向滚动距离 | scrollLeft |
| getVerticalScroll         | 获取纵向滚动距离    | —          |
| getLeftHorizontalScroll   | 获取左到右横向滚动距离 | —          |
| getRightHorizontalScroll  | 获取右往左横向滚动距离 | —          |
| getColumns                | 获取列项        | —          |
| populate                  | 增加行         | rows       |
| restore                   | 存储数据        | —          |

------

