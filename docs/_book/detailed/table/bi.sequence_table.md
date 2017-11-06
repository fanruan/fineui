# sequence_table

## 优化过性能的列表,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/ggcdop1x/)

{% common %}
```javascript

BI.createWidget({
   type: "bi.sequence_table",
   header: [],
   items: [],
});



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| crossHeader | 列表头 | array | —  | 100 |
| crossItems | 列items | array | - | 0 |
| freezeCols | 冻结Column | array | - | 0 |
| mergeCols | 合并Column | array | - | 0 |
| header | 行表头 | array | - | 0 |
| items | 行items | array | - | 0 |
| columnSize | 列宽 | array | - | 0 |
| minColumnSize | 最小列宽 | array | - | 0 |



## 对外方法
| 名称     | 说明                           |  回调参数
| :------ |:-------------                  | :-----
| populate | 刷新列表 | items |



---