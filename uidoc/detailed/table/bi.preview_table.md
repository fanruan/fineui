# bi.preview_table

### 用于表格预览

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
### 参见[Table](#)方法

