# bi.icon_combo

## 切换trigger图标的combo 基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/z02vzvtb/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.icon_combo",
  element: "#wrapper",
  iconClass: "rename-font",
  items: [{
    value: "第一项",
    iconClass: "delete-font"
  }, {
    value: "第二项",
    iconClass: "rename-font"
  }, {
    value: "第三项",
    iconClass: "move-font"
  }]
});



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| width | 宽度 | number | — | 24
| height | 高度 | number | — | 24
| iconClass | icon的类名 | string  | —|" "|
| el | 自定义下拉框trigger| object | —|{ } |
| popup | 弹出层| object | —| { }
| minWidth| 最小宽度| number | —|100|
| maxWidth | 最大宽度 | string/number | — | "auto"|
| maxHeight | 最大高度 | number | —| 300
| adjustLength | 弹出列表和trigger的距离 | number | — | 0 |
| adjustXOffset | 调整横向偏移 | number | — | 0 |
| adjustYOffset |调整纵向偏移 | number | — | 0 |
| offsetStyle | 弹出层显示位置 | string | left,right,center | "left,right,center"|
| chooseType | 选择类型 | const | 参考button_group | BI.ButtonGroup.CHOOSE_TYPE_SINGLE |
 


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| setValue| 设置value值|—|
| getValue| 获取value值|—|
| showView | 显示弹出层 | —|
| hideView | 隐藏弹出层 |—|
| populate | 刷新列表 | items |





---


