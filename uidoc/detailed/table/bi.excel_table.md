# bi.excel_table

### 类似excel式的表格

{% method %}
[source](https://jsfiddle.net/fineui/cbmv07g4/)

{% common %}
```javascript
BI.createWidget({
  type: "bi.excel_table",
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
| isNeedResize     | 是否需要调整大小      | bool                 | false             |
| isResizeAdapt    | 是否调整时自适应      | bool                 | true              |
| isNeedMerge      | 是否需要合并单元格     | bool                 | false             |
| mergeCols        | 合并的单元格列号      | array                | []                |
| mergeRule        | 合并规则, 默认相等时合并 | function(row1, row2) | 默认row1 = row2 时合并 |
| columnSize       | 单元格宽度集合       | array                | []                |
| headerRowSize    | 表头高度          | number               | 37                |
| footerRowSize    | 表尾高度          | number               | 37                |
| rowSize          | 普通单元格高度       | number               | 37                |
| regionColumnSize |               | bool                 | false             |
| items            | 子组件           | array                | []                |

## 方法
### 参见[Table](#)方法





