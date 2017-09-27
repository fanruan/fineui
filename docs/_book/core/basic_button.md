# bi.basic_button

## 一般的button父级,表示一个可以点击的区域,基类[BI.Single](/core/single.md)

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| stopEvent | 是否阻止事件 |boolean | true,false | false |
| stopPropagation | 是否阻止冒泡 | boolean | true,false| false |
| selected | button的选中状态 | boolean | true,false |false |
| once | 点击一次选中有效,再点无效 | boolean | true,false | false|
| forceSelected | 点击即选中, 选中了就不会被取消,与once的区别是forceSelected不影响事件的触发| boolean | true,false| false|
| forceNotSelected | 无论怎么点击都不会被选中 | boolean| true,false | false|
| disableSelected | 使能选中| boolean | true,false| false|
| shadow | 是否显示阴影 | boolean| true,false| false|
| isShadowShowingOnSelected| 选中状态下是否显示阴影|boolean|  true,false | false|
| trigger | 被选元素要触发的事件 | string | mousedown, mouseup, click, dblclick, lclick | null|
| handler | 点击事件回调 | function | —| BI.emptyFn |


## 对外方法
| 名称     | 说明                           |  回调参数
| :------ |:-------------                  | :-----
| hover | 触发hover| —|
| dishover | 取消触发hover| —|
| setSelected | 设置选中| b|
| isSelected | 是否被选中| —|
| isOnce | 是否只允许点击一次| —|
| isForceSelected| 判断是否点击即选中| —|
| isForceNotSelected| 判断是否怎么点击都不会被选中|—|
| isDisableSelected| 判断是否不让选中|—|
| setText| 设置文本值|—|
| getText| 获取文本值|—|

## 用于继承的方法
| 名称     | 说明                           |  回调参数
| :------ |:-------------                  | :-----
| beforeClick | 点击事件之前钩子 | —|
| doClick | 点击之后钩子 | — |
| handle | 获取事件作用的对象 | —|


---


