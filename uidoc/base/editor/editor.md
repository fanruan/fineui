# bi.editor

## 文本框,基类[BI.Single](/core/single.md)

{% method %}
[source](https://jsfiddle.net/fineui/4eLytgve/)

{% common %}
```javascript

BI.createWidget({
	type: "bi.editor",
	element: "#wrapper",
	errorText: "字段不可重名!",
	width: 200,
	height: 30
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| hgap    | 效果相当于文本框左右padding值 |  number  |     |     4   |
| vgap    | 效果相当于文本框上下padding值 |  number  |  |      2  |
| lgap    | 效果相当于文本框left-padding值     |    number   |        |  0    |
| rgap    | 效果相当于文本框right-padding值     |    number  |       |  0    |
| tgap    |效果相当于文本框top-padding值     |    number   |  |  0    |
| bgap    |  效果相当于文本框bottom-padding值     |    number  |   |  0    |
| validationChecker    | 输入较验函数      |function|    |      |
| quitChecker    | 是否允许退出编辑函数      |   function    |  |       |
| mouseOut    |       |    boolean   | true,false  |  false | 
| allowBlank    |  是否允许空值     |    boolean    | true,false |  false    |
| watermark    |   文本框placeholder    |   string   |   |  " "    |
| errorText    |  错误提示     |  string/function     | | " "|
| tipType| 提示类型 | string |success,warning | "warning"|
| inputType| 输入框类型| string| | "text"|



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| setErrorText | 设置错误文本 | text |
| getErrorText | 获取错误文本 | —|
| setErrorVisible | 设置错误文本可见|b  |
| disableError | 设置error不可用|— |
| enableError| 设置error可用| —|
| disableWaterMark | 设置文本框placeholder不可用| —|
| enableWaterMark | 恢复文本框placeholder可用| — |
| focus | 文本框获取焦点| — |
| blur | 文本框失焦|—|
| selectAll | 选中文本框文本| —|
| onKeyDown |按键事件|key|
| setValue | 设置文本框值|value|
| getLastValidValue | 获取文本框最后一次输入的有效值| —|
| resetLastValidValue| 重置文本框最后一次输入的有效值|value|
| getValue | 获取文本框值|—|
| isEditing | 文本框是否处于编辑状态|—|
| isValid | 文本框值是否有效|—|

 


---


