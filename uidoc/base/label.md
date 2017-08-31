# bi.label

#### 文本标签

{% method %}
[source](https://jsfiddle.net/fineui/47f5ps1j/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.label",
	textWidth: 100,
	textHeight: 30,
	text: "基本标签"
});


```

{% endmethod %}


## API
##### 基础属性

| 参数    | 说明                           | 类型       | 可选值 | 默认值
| :------ |:-------------                  | :-----     | :----|:----
| hgap    | 效果相当于容器左右padding值    |    number  |  |  0  |
| vgap    | 效果相当于容器上下padding值    |    number  |  |  0  |
| lgap    | 效果相当于容器left-padding值   |    number  |  |  0  |
| rgap    | 效果相当于容器right-padding值  |    number  |  |  0  |
| tgap    | 效果相当于容器top-padding值    |    number  |  |  0  |
| bgap    | 效果相当于容器bottom-padding值 |    number  |  |  0  |
| textWidth   | 文本标签宽度     |    number|   | null    |
| textHeight  | 文本标签宽度     |    number|   | null    |
| text    | 文本内容        |    string |  | " " |


##### 高级属性

| 参数    | 说明                           | 类型       | 可选值 | 默认值
| :------ |:-------------                  | :-----     | :----|:----
| textAlign  | 文本对齐方式     |    string  |  left,center,right | center |
| whiteSpace | 元素内空白处理方式    |    string| normal,nowrap | nowrap|
| forceCenter | 是否无论如何都要居中, 不考虑超出边界的情况, 在未知宽度和高度时有效    |    boolean | true,false |  true |
| py      |      |    string |  | 空 |
| keyword |      |    string |  | 空 |
| disabled | 灰化     |    boolean| true,false | 无 |
| title  | 提示title     |    string |  | 空 |
| warningTitle | 错误提示title     |    string |  | 空 |

## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| doRedMark | 文本标红  | —  |
| unRedMark | 取消文本标红| —|
| doHighLight | 文本高亮 | —|
| unHighLight | 取消文本高亮 | —|
| setText| 设置文本值 | 需要设置的文本值text|
| getText| 获取文本值 | —|
| setStyle | 设置文本样式 |需要设置的文本标签样式,例{"color":"#000"} |
| setValue | 设置文本值 | 需要设置的文本值text |
| populate| | —|






---