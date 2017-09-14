# bi.code_editor

## 代码文本框,基类[BI.Single](/core/single.md)

{% method %}
[source](https://jsfiddle.net/fineui/fx86hLgm/)

{% common %}
```javascript

BI.createWidget({
   type: "bi.code_editor",
   cls: "mvc-border",
   width: 600,
   height: 400
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| watermark    |   文本框placeholder    |   string   | —  |  " "    |
| readOnly |  是否只读     |   boolean    | true,false | false|
| lineHeight | 行高 | number|— | 2|
| value | 文本框值| string| —| " "|
| paramFormatter|  参数显示值构造函数    |    function| — |  value   |



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| insertParam | 插入参数 | param |
| insertString | 插入字符串 | str|
| getValue | 获取文本框值|—|
| setValue | 设置文本框值|value|
| focus | 文本框获取焦点| — |
| blur | 文本框失焦|—|
| setStyle | 设置文本样式 |需要设置的文本标签样式style,例{"color":"#000"} |
| getStyle | 获取文本样式 |— |
| refresh | 刷新文本框 | —|

 


---


