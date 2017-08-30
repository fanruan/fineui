# bi.td

### 单元格控件，继承BI.Layout

{% method %}
[source](https://jsfiddle.net/fineui/v4jrz6a3/)

{% common %}
```javascript
BI.createWidget({
  type: "bi.td",
  element: 'body',
  columnSize: [20, 20, 'fill'],
  items: []
});
```

{% endmethod %}



##参数

| 参数         | 说明   | 类型     | 默认值                                      |
| ---------- | ---- | ------ | ---------------------------------------- |
| columnSize | 列宽   | array  | [200, 200, 200]                          |
| hgap       | 纵向间隙 | number | 0                                        |
| vgap       | 横向间隙 | number | 0                                        |
| items      | 内容项  | array  | [[{el: {text: 'label1'}},{ el: {text: 'label2'},{ el: {text: 'label3'} |


## 方法

| 方法名      | 说明     | 用法               |
| -------- | ------ | ---------------- |
| addItem  | 增加内容   | addItem(arr)     |
| populate | 更换新的内容 | poplulate(items) |

