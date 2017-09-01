# bi.virtual_list

## VirtualList,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/L995LrL9/)

{% common %}
```javascript

 var ITEMS =  BI.map("柳州市城贸金属材料有限责任公司 柳州市建福房屋租赁有限公司 柳州市迅昌数码办公设备有限责任公司 柳州市河海贸易有限责任公司 柳州市花篮制衣厂 柳州市兴溪物资有限公司 柳州市针织总厂 柳州市衡管物资有限公司 柳州市琪成机电设备有限公司 柳州市松林工程机械修理厂".match(/[^\s]+/g), function (i, v) {
        return {
            text: v,
            value: v,
            title: v
        }
});

BI.createWidget({
	type: "bi.virtual_list",
	element:"body",
	items: BI.map(ITEMS, function (i, item) {
	      return BI.extend({}, item, {
	          type: "bi.label",
	          height: 30,
	          text: (i + 1) + "." + item.text,
	      });
	  })
	})



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| items | 子组件数组 | array |   | [ ] |
| blockSize | | number |  | 10 |
| overscanHeight | | number |  | 100 |
| scrollTop |  滚动条相对于顶部的偏移 | number | — | 0 |


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| render | 渲染列表 | —|
| mounted | 组件挂载 | —|
| restore | 还原列表设置 | — |
| populate | 刷新列表 | items |
| destroyed | 销毁组件 | —|



---


