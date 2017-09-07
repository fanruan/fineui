# bi.expander

## 某个可以展开的节点,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/2xavqk4k/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.expander",
  element: "#wrapper",
  el: {
    type: "bi.icon_text_node",
    cls: "pull-right-ha-font",
    height: 25,
    text: "Expander"
  },
  popup: {
    items: [{
      type: "bi.single_select_item",
      height: 25,
      text: "项目1",
      value: 1
    }, {
      type: "bi.single_select_item",
      height: 25,
      text: "项目2",
      value: 2
    }]
  }
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
| popup | 弹出层 | object | — | { }|
| expanderClass | 展开类 | string | —| "bi-expander-popup" |
| hoverClass | hover类| string | — | "bi-expander-hover" |



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| populate | 刷新列表 | items  |
| setValue | 设置combo value值| v |
| getValue | 获取combo value值 | —|
| isViewVisible | 弹窗层是否可见 | —|
| showView | 显示弹出层| —|
| hideView | 隐藏弹出层| —|
| getView | 获取弹出层| —|
| getAllLeaves | 获取所有的叶子节点 | —|
| getNodeById | 根据id获取节点 | id |
| getNodeByValue | 根据value值获取节点 | value |
| isExpanded |  节点是否展开 | — |
| destroy | 销毁组件| — |

## 事件
| 名称     | 说明                |
| :------ |:------------- |
|BI.Expander.EVENT_TRIGGER_CHANGE | trigger发生改变触发   |
|BI.Expander.EVENT_CHANGE |  弹出层点击触发          |
|BI.Expander.EVENT_EXPAND |  Expander展开触发   |
|BI.Expander.EVENT_COLLAPSE |    Expander收起触发
|BI.Expander.EVENT_AFTER_INIT |  Expander初始化后触发 |
|BI.Expander.EVENT_BEFORE_POPUPVIEW | 下拉列表弹出前触发 |
|BI.Expander.EVENT_AFTER_POPUPVIEW | 下拉列表弹出后触发 |
|BI.Expander.EVENT_BEFORE_HIDEVIEW | 下拉列表收起前触发 |
|BI.Expander.EVENT_AFTER_HIDEVIEW | 下拉列表收起后触发 |

---


