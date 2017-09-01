# bi.combo

## combo,基类[BI.Widget](/core/widget.md)

{% method %}
[source]()

{% common %}
```javascript

BI.createWidget({
   type: "bi.combo",
   element: “body”,
   adjustLength: 2,
   el: {
	   type: "bi.button",
       text: "测试",
       height: 25
	},
   popup: {
       el: {
	      type: "bi.button_group",
          items: BI.makeArray(100, {
              type: "bi.text_item",
              height: 25,
              text: "item"
          }),
          layouts: [{
              type: "bi.vertical"
          }]
       },
       maxHeight: 300
   }
});



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| trigger | 事件类型 | string |  | "click" |
| toggle | 切换状态 | boolean | true,false | true |
| direction | combo弹出层位置 | string | top,bottom,left,right,(top,left),(top,right),(bottom,left),(bottom,right) | "bottom"|
| isDefaultInit | 是否默认初始化 |boolean | true,false | false |
| destroyWhenHide | 隐藏弹窗层是否销毁 | boolean | true,false | false |
| isNeedAdjustHeight | 是否需要高度调整 | boolean | true,false | true |
| isNeedAdjustWidth | 是否需要宽度调整 | boolean | true,false | true |
| stopEvent | 阻止事件冒泡 | boolean | true,false | false |
| stopPropagation | 阻止事件冒泡 | boolean | true,false | false |
| adjustLength | 调整的距离 | number | — | 0 |
| adjustXOffset | 调整横向偏移 | number | — | 0 |
| adjustYOffset |调整纵向偏移 | number | — | 0 |
| hideChecker | | function | | —|
| offsetStyle | 弹出层显示位置 | string | left,right,center | "left,right,center"|
| el | 开启弹出层的元素 | object | — |{ }|
| popup | 弹出层 | object | — | { }|
| comboClass | | string | | "bi-combo-popup" |
| hoverClass | | string | | "bi-combo-hover" |



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| adjustWidth | 调整宽度 | —|
| adjustHeight | 调整高度  | —|
| resetListHeight | 重置列表高度 | height |
| resetListWidth | 重置列表宽度 | width |
| populate | 刷新列表 | items  |
| setValue |设置combo value值| v |
| getValue | 获取combo value值 | —|
| isViewVisible | 弹窗层是否可见 | —|
| showView | ||
| hideView |||
| getView |||
| getPopupPosition |||
| toggle |||
|destroy |||


---


