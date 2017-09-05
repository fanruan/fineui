# bi.textarea_editor

## 文本域,基类[BI.Single](/core/single.md)

{% method %}
[source](https://jsfiddle.net/fineui/90721e0a/)

{% common %}
```javascript

BI.createWidget({
   type: "bi.textarea_editor",
   width: 400,
   height: 300
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| value | 文本域的值 | string  |  | " "|



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| getValue | 获取文本域值|—|
| setValue | 设置文本域值|value|
| setStyle | 设置文本域样式 |需要设置的文本域样式style,例{"color":"#000"} |
| getStyle | 获取文本域样式 |— |
| focus | 文本域获取焦点| — |
| blur | 文本域失焦|—|

 


---


