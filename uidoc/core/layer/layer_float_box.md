# bi.float_box

## floatBox弹出层,[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/72gp1n0p/)

{% common %}
```javascript

var id = BI.UUID();

BI.createWidget({
  element: "#wrapper",
  type: "bi.text_button",
  text: "点击弹出FloatBox",
  width: 200,
  height: 80,
  handler: function() {
    BI.Popovers.remove(id);
    BI.Popovers.create(id, new BI.BarPopoverSection()).open(id);
  }
})




```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| width | 弹出层宽度 | number | — | 600 |
| height | 弹出层高度 | number | — | 500 |


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| populate | 刷新列表 | sectionProvider |
| destroyed| 销毁组件|—|
| show | 显示 | —|
| hide |  隐藏 | —|
| open | 打开弹出层 | —|
| close| 关闭弹出层 | —|
| setZindex | 设置z-index| z-index | 


## 事件方法

| 事件名称| 说明| 回调参数 | 
| :------ |:-------------  | :-----
| EVENT_FLOAT_BOX_CLOSED | 关闭弹出层 | —|
| EVENT_FLOAT_BOX_CLOSED | 打开弹出层 |  —|



---


