# bi.searcher_view

## 搜索面板, 基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/qkfns6wm/)

{% common %}
```javascript

var searcher = BI.createWidget({
  element: "#wrapper",
  type: "bi.searcher_view",
});
searcher.populate([{
	text: "aba",
  value: "aba"
},{
	text: "acc",
  value: "acc"
}], [{
	text: "a",
  value: "a"
}], "a");



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| tipText | title文本 | string | — | BI.i18nText("BI-No_Select") |
| chooseType | 选择类型 | const | 参考button_group | BI.Selection.Single |
| matcher | 完全匹配的构造器 | object | — | {type: "bi.button_group",behaviors: { redmark: function () { return true;} },items: [], layouts: [{ type: "bi.vertical"}]} |
| searcher | 搜索到的元素 | object| — | {type: "bi.button_group",behaviors: {redmark: function () {return true;}}, items: [], layouts: [{  type: "bi.vertical" }]}|

## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| populate | 刷新列表 | searchResult, matchResult, keyword |
| setValue | 设置value 值 | value |
| getValue| 获取value值 | —|
| empty | 清空组件 | —|
| hasMatched | 是否有匹配的元素 | —|



---


