# bi.pane

## 当没有元素时有提示信息的view, [BI.Widget](/core/widget.md)


## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| tipText | title文本 | string | — | BI.i18nText("BI-No_Selected_Item") |
| overlap|  是否含有遮罩层 | boolean | true,false | true |
| onLoaded | 已经加载 | function | — | — |


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| populate | 刷新列表 | items |
| empty | 清空组件 | — |
| hasMatched | 是否有匹配的元素 | —|
| loading | 加载中 | — |
| loaded | 加载完毕 | —
| check | 检查是否为空| —
| setTipVisible | 设tip可见| —





---


