# bi.combo

## combo,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/wxykkjou/)

{% common %}
```javascript

BI.createWidget({
   type: "bi.combo",
   element: "body",
   adjustLength: 2,
   el: {
	   type: "bi.button",
       text: "测试",
       height: 25
	},
   popup: {}
});



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| el | 自定义下拉框trigger | object | — |{ }|
| trigger | 下拉列表的弹出方式  | string |  click,hover | "click" |
| adjustLength | 弹出列表和trigger的距离 | number | — | 0 |
| toggle | 切换状态 | boolean | true,false | true |
| direction | 弹出列表和trigger的位置关系 | string | top &#124; bottom &#124; left &#124; right &#124; top,left &#124; top,right &#124; bottom,left &#124; bottom,right  | "bottom"|
| isDefaultInit | 是否默认初始化子节点 |boolean | true,false | false |
| destroyWhenHide | 隐藏弹窗层是否销毁 | boolean | true,false | false |
| isNeedAdjustHeight | 是否需要高度调整 | boolean | true,false | true |
| isNeedAdjustWidth | 是否需要宽度调整 | boolean | true,false | true |
| stopEvent | 是否阻止事件 | boolean | true,false | false |
| stopPropagation | 阻止事件冒泡 | boolean | true,false | false |
| adjustXOffset | 调整横向偏移 | number | — | 0 |
| adjustYOffset |调整纵向偏移 | number | — | 0 |
| hideChecker | 是否隐藏弹出层检测 | function | — | —|
| offsetStyle | 弹出层显示位置 | string | left,right,center | "left,right,center"|
| popup | 弹出层 | object | — | { }|
| comboClass | combo类 | string | — | "bi-combo-popup" |
| hoverClass | hover类 | string | — | "bi-combo-hover" |



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
| showView | 显示弹出层 | —|
| hideView | 隐藏弹出层 |—|
| getView | 获取弹出层 | —|
| getPopupPosition | 获取弹出层的位置 | —|
| toggle | 开启或者隐藏弹出层 | —|
| destroy | 销毁组件 | —|

## 事件
| 名称     | 说明                |
| :------ |:------------- |
|BI.Combo.EVENT_TRIGGER_CHANGE | trigger发生改变触发   |
|BI.Combo.EVENT_CHANGE |  弹出层点击触发          |
|BI.Combo.EVENT_EXPAND |  下拉框展开触发   |
|BI.Combo.EVENT_COLLAPSE |    下拉框收起触发
|BI.Combo.EVENT_AFTER_INIT |  下拉框初始化后触发 |
|BI.Combo.EVENT_BEFORE_POPUPVIEW | 下拉列表弹出前触发 |
|BI.Combo.EVENT_AFTER_POPUPVIEW | 下拉列表弹出后触发 |
|BI.Combo.EVENT_BEFORE_HIDEVIEW | 下拉列表收起前触发 |
|BI.Combo.EVENT_AFTER_HIDEVIEW | 下拉列表收起后触发 |


---


