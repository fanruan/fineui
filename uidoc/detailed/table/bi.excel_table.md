# bi.excel_table

{% method %}
[source](https://jsfiddle.net/fineui/cbmv07g4/)

{% common %}
```javascript
var items = [];

for (var i = 0; i < 8; i++) {
	var temp = [];
	for (var j = 0; j < 6; j++) {
  	var obj = {
    	type: "bi.label",
      cls: "layout-bg1",
      text: "第" + (i+1) + "行第" + (j+1) + "列"
    };
    temp.push(obj);
  }
  items.push(temp);
}

BI.createWidget({
  type: "bi.excel_table",
  element: "#wrapper",
  width: 500,
  columnSize: [200,200,200,200,200],
  items: items,
});
```

{% endmethod %}

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







