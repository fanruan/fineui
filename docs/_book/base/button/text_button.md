# bi.text_button

## 可以点击的一行文字,基类[BI.BasicButton](/core/basicButton.md)

{% method %}
[source](https://jsfiddle.net/fineui/5p99L39q/)

{% common %}
```javascript

BI.createWidget({
 type: 'bi.text_button',
 text: '文字按钮',
 height: 30
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| hgap    | 效果相当于文本框左右padding值，如果clear属性为true,该属性值置0 |  number  |  —   |     10   |
| lgap    | 效果相当于文本框left-padding值     |    number   |   —    |  0    |
| rgap    | 效果相当于文本框right-padding值     |    number  |   —    |  0    |
| text|按钮文本内容     |    string| — | — |
| textWidth| 按钮文本宽度  |   number|  — |  null    |
| textHeight    |   按钮文本高度    |    number|  —  | null |


##### 高级属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| py |  拼音   |    string|  | " "  |
| textAlign | 文字布局      |   string    | left,center,right |   cneter    |
| whiteSpace | 元素内的空白处理方式  |    string | normal,nowrap  |  nowrap| 
| forceCenter | 是否无论如何都要居中, 不考虑超出边界的情况, 在未知宽度和高度时有效      |    boolean    | true,false |  false    |


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| doRedMark | 文本标红  | —  |
| unRedMark | 取消文本标红| —|
| doHighLight | 文本高亮 | —|
| unHighLight | 取消文本高亮 | —|
| setText| 设置文本值 | 需要设置的文本值text|
| doClick | 点击事件 | —|
| setValue | 设置文本值 | 需要设置的文本值text |
| setStyle | 设置文本样式 |需要设置的文本标签样式,例{"color":"#000"} |


---


