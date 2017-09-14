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
| value | 文本域的值 | string  | — | " "|
| watermark | 文本框placeholder| string | —| " " |
| fieldTextValueMap |  字段集合 | onject | —| {}|
| showHint | 是否显示提示信息 | boolean | true,false | true |
| lineHeight | 行高 | number | —| 2|



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| disableWaterMark |  设置文本框placeholder不可用 | — |
| focus | 文本框获取焦点| — |
| insertField | 添加字段 | field |
| insertFunction |  插入函数 | fn |
| insertOperator |  插入操作符| op|
| setFunction | 设置函数 | v|
| insertString | 插入字符串 | str|
| getFormulaString | 获取公式框内容 |— |
| getUsedFields | 获取可用字段 | — |
| getCheckString |  获取校验内容 | — |
| getValue | 获取文本框值|—|
| setValue | 设置文本框值|value|
| setFieldTextValueMap | 设置字段集合 | fieldTextValueMap |
| refresh | 刷新文本框 | —|
 


---


