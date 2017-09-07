# bi.virtual_list

## 看不见的元素全部删除的list,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/L995LrL9/)

{% common %}
```javascript

BI.createWidget({
	type: "bi.virtual_list",
	element:"body",
	items: BI.map([{value: "xxxx"}], function (i, item) {
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
| items | 子组件数组 | array | —  | [ ] |
| blockSize | 滚动加载的个数 | number | — | 10 |
| overscanHeight | 超出可视范围区域的高度 | number | — | 100 |
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


