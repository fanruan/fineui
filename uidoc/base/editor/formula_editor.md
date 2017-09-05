# bi.formula_editor

## 公式编辑控件,基类[BI.Single](/core/single.md)

{% method %}
[source](https://jsfiddle.net/fineui/qnquz4o0/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.formula_editor",
  cls: "bi-border",
  watermark:'请输入公式',
  value: 'SUM(C5, 16, 26)',
  width: "100%",
  height: "100%"
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| value | 文本域的值 | string  |  | " "|
| watermark | 文本框placeholder| string | | " " |
| fieldTextValueMap | | string| | {}|
| showHint | | | | 2 |
| lineHeight | 行高 | number | | 2|



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| disableWaterMark |  设置文本框placeholder不可用 | — |
| focus | 文本框获取焦点| — |
| insertField | 添加字段 | field |
| insertFunction | | fn |
| insertOperator | | op|
| setFunction | | v|
| insertString | 插入字符串 | str|
| getFormulaString | |— |
| getUsedFields | | — |
| getCheckString |   | — |
| getValue | 获取文本框值|—|
| setValue | 设置文本框值|value|
| setFieldTextValueMap | | fieldTextValueMap |
| refresh | 刷新文本框 | —|
 


---


