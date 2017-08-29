# bi.responsive_table

### 自适应宽度的表格

{% method %}
[source](https://jsfiddle.net/fineui/y70jwztm/)

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
  type: "bi.responsive_table",
  isNeedMerge: true,
  isNeedFreeze: true,
  mergeCols: [0, 1],
  columnSize: ["", "", ""],
  items: items,
  header: header,
  element: 'body'
});
```

{% endmethod %}

##参数

| 参数               | 说明                                   | 类型       | 默认值      |
| ---------------- | ------------------------------------ | -------- | -------- |
| isNeedFreeze     | 是否需要冻结单元格                            | bool     | false    |
| freezeCols       | 冻结的列号,从0开始,isNeedFreeze为true时生效      | array    | []       |
| isNeedMerge      | 是否需要合并单元格                            | bool     | false    |
| mergeRule        | function (row1, row2)  合并规则, 默认相等时合并 | function | function |
| columnSize       | 列宽                                   | array    | []       |
| headerRowSize    | 表头行高                                 | number   | 25       |
| footerRowSize    | 表尾行高                                 | number   | 25       |
| rowSize          | 行高                                   | number   | 25       |
| columnSize       | 列宽                                   | array    | []       |
| regionColumnSize |                                      | bool     | false    |
| header           | 表头内容                                 | array    | []       |
| footer           | 是否需要表尾                               | bool     | false    |
| items            | 子组件二维数组                              | array    | []       |
| crossHeader      | 交叉表头                                 | array    | []       |
| crossItems       | 交叉表内容二维数组                            | array    | []       |

## 方法
### 参见[Table](#)方法