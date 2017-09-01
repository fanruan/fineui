# bi.custom_tree

## 自定义树,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/gesh31xg/)

{% common %}
```javascript

var TREEITEMS=[{
	id: -1,
	pId: -2,
	value: "根目录",
	open: true,
	type: "bi.plus_group_node",
	height: 25
},
{
	id: 1,
	pId: -1,
	value: "第一级目录1",
	type: "bi.plus_group_node",
	height: 25
},
{
	id: 11,
	pId: 1,
	value: "第二级文件1",
	type: "bi.single_select_item",
	height: 25
}];
BI.createWidget({
	type: "bi.custom_tree",
	el: {
		type: "bi.button_tree",
		chooseType: 0,
		layouts: [{
			type: "bi.vertical",
			hgap: 30
		}]
	},
	items: BI.deepClone(TREEITEMS)
});




```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| items | 子组件数组 | array |   | [ ] |
| itemsCreator|  |  |   |  |
| expander | | object |   | {el: {},popup: {type: "bi.custom_tree"}}|
| el |  | object | | {type: "bi.button_tree",chooseType: 0,layouts: [{type: "bi.vertical"}]}|



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| initTree | 构造树结构 | nodes |
| stroke | 生成树方法 | nodes |
| prependItems | 内部前插入 | items |
| addItems | 内部后插入 | items |
| populate | 刷新列表 | nodes|
| render | 渲染列表 |  |
| setValue | 设置value值 | value,可以是单个值也可以是个数组 |
| getValue | 获取被选中的值 |—|
| getAllButtons | 获取所有button |—|
| getAllLeaves | 获取所有的叶子节点 | —|
| getNodeById | 根据id获取节点 | id |
| getNodeByValue | 根据value值获取节点 | value |
| empty| 清空组件|—|



---


