# bi.switcher

## 切换显示或隐藏面板,[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/4sj60ap0/)

{% common %}
```javascript

BI.createWidget({
  element: "#wrapper",
  type: "bi.switcher",
  el: {
    type: "bi.button",
    height: 25,
    text: "Switcher"
  },
  popup: {
  	
  },
  adapter: { 

  }
})




```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| trigger | 下拉列表的弹出方式 | string |  click,hover | "click" |
| toggle | 切换状态 | boolean | true,false | true |
| direction | 面板显示的位置 | string | — | BI.Direction.Top |
| el | 自定义下拉框trigger | object | —  | { }|
| popup | 弹出层 | object | — |{ }|
| adapter | 弹出层的位置 | object | — | null| 
| masker | masker层 | obejct | — | { }|
| switcherClass | 切换类 | string| —| "bi-switcher-popup" |
| hoverClass | hover类 | string | — | "bi-switcher-hover" |

## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| setValue | 设置value值 | value |
| getValue | 获取被选中的值 |—|
| empty| 清空组件|—|
| destroy| 销毁组件|—|
| populate | 刷新列表 | items  |
| isViewVisible | 弹窗层是否可见 | —|
| showView | 显示弹出层 | —|
| hideView | 隐藏弹出层|—|
| getView | 获取弹出层|—|
| getAllLeaves | 获取所有的叶子节点 | —|
| getNodeById | 根据id获取节点 | id |
| getNodeByValue | 根据value值获取节点 | value |
| isExpanded |  节点是否展开 |— |
| setAdapter | 设置弹出层显示的位置元素|adapter|
| adjustView| 调整弹出层显示的位置元素 |—|

## 事件方法

| 事件名称| 说明| 回调参数 | 
| :------ |:-------------  | :-----
| EVENT_EXPAND | 面板展开 | —|
| EVENT_COLLAPSE | 面板收起 |  —|
| EVENT_TRIGGER_CHANGE | 面板切换 | —|
| EVENT_AFTER_INIT | 初始化之后 | —|
| EVENT_BEFORE_POPUPVIEW | 面板显示之前| —|
| EVENT_AFTER_POPUPVIEW | 面板显示之后| —|
| EVENT_BEFORE_HIDEVIEW | 面板隐藏之前| —|
| EVENT_AFTER_HIDEVIEW | 面板隐藏之后 | —|


---


