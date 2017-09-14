# bi.button

## 文字类型的按钮,基类[BI.BasicButton](/core/basicButton.md)

{% method %}
[source](https://jsfiddle.net/fineui/txqwwzLm/)

{% common %}
```javascript

BI.createWidget({
  type: 'bi.button',
  element: "#wrapper",
  text: '一般按钮',
  level: 'common',
  height: 30
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| hgap    | 效果相当于文本框左右padding值，如果clear属性为true,该属性值置0 |  number  | —    |     10   |
| vgap    | 效果相当于文本框上下padding值 |  number  | — |      0  |
| lgap    | 效果相当于文本框left-padding值     |    number   |   —     |  0    |
| rgap    | 效果相当于文本框right-padding值     |    number  |   —    |  0    |
| tgap    |效果相当于文本框top-padding值     |    number   | — |  0    |
| bgap    |  效果相当于文本框bottom-padding值     |    number  |  — |  0    |
| items | 子控件数组     |    array | — | [ ] |
| width    |   宽度    |    number   |  — | —    |
| height    |   高度    |    number   | — |   —   | 


##### 高级属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| level |按钮类型     |    string| common,success,warning,ignore |  common |
| minWidth    | 最小宽度，如果block/clear中某一项为true，此项值为0，否则为90 |  number  |  —   |     90   |
| shadow    | 是否显示阴影 |  boolean| true,false |   props.clear !== true   |
| isShadowShowingOnSelected|选中状态下是否显示阴影 |  boolean| true,false |      true  |
| readonly    | 是否只读     |    boolean   |   true,false     |  true   |
| iconClass    | 图标类型     |    string|     —  | " "|
| block|  是否块状显示，即不显示边框，没有最小宽度的限制    |    boolean| true,false  |  false    |
| clear| 是否去掉边框和背景      |boolean| true,false   |  false    |
| textAlign | 文字布局      |   string    | left,center,right |   cneter    |
| whiteSpace | 元素内的空白处理方式  |    string | normal,nowrap  |  nowrap| 
| forceCenter | 是否无论如何都要居中, 不考虑超出边界的情况, 在未知宽度和高度时有效      |    boolean    | true,false |  false    |
| textWidth| 按钮文本宽度  |   number| —  |  null    |
| textHeight    |   按钮文本高度    |    number|  —  | null |

## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| doRedMark | 文本标红  | —  |
| unRedMark | 取消文本标红| —|
| doHighLight | 文本高亮 | —|
| unHighLight | 取消文本高亮 | —|
| setText| 设置文本值 | 需要设置的文本值text|
| doClick | 点击事件 | —|
| destroy | 销毁事件 |— |
| setValue | 设置文本值 | 需要设置的文本值text |

---


