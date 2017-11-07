# bi.pane

## 没有元素有提示信息，可以提供loading和loaded状态的面板, [BI.Widget](/core/widget.md)


## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| tipText | 提示文本 | string | — | BI.i18nText("BI-No_Selected_Item") |
| overlap|  loading图标是否在元素内部创建，true表示覆盖一层创建 | boolean | true,false | true |
| onLoaded | 加载之后的钩子 | function | — | — |


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| populate | 刷新列表 | items |
| hasMatched | 是否有匹配的元素 | —|
| loading | 设置加载中，一般在继承类中调用 | — |
| loaded | 设置加载完毕，一般在继承类中调用 | —
| check | 检查当前面板状态| —




---


