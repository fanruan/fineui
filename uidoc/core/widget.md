# bi.widget

## 所有控件的超类

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| root | | boolean | true,false | false |
| tagName | | string| | "div" |
| attributes | | | | null |
| data | | | | null |
| disabled | 是否可用 |  boolean |true,false | false |
| invisible | | boolean | true,false | false|
| invalid | 是否有效 | boolean | true,false |false |
| baseCls | 基础class类 | string | | " "|
| extraCls | 扩展class类 | string|  | " "|
| cls | class类名 | string | | " "|

## 生命周期函数
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| beforeCreate | 组件实例刚被创建 |— |
| created | 组件实例创建完成 | —|
| render | 渲染组件 | — |
| beforeMounted | 组件挂载之前| —|
| mounted | 组件挂载 |—|
| update | 组件更新 | —|
| beforeDestroyed | 组件销毁前调用| —|
| destroyed | 组件销毁后调用 | —|


## 对外方法
#####(注: fineui2.0引入生命周期后，widget的实现类不需要重写setEnable，setValid等方法，会自动调用子组件的对应方法
,一些需要在设置状态后做的额外工作可以通过重写_setXXX来实现)
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| isMounted | 判断组件是否挂载| — |
| setWidth | 设置组件宽度 | width |
| setHeight | 设置组件高度 | height |
| setEnable | 设置组件是否可用 | enable |
| setVisible | 设置组件是否可见 | visible |
| setValid | 设置组件是否有效 | valid|
| doBehavior | | —|
| getWidth | 获取组件宽度 | —|
| getHeight| 获取组件高度| —|
| isValid | 判断是否有效 | —|
| addWidget | 添加组件 | name,widget|
| getWidgetByName | 根据组件名称获取组件| name |
| removeWidget | 移除组件 | nameOrWidget |
| hasWidget | 判断是否有该组件 | name |
| getName | 获取组件名称 | | 
| setTag | 设置tag | tag |
| getTag | 获取tag | —|
| attr | 设置组件属性 | key,value |
| getText | 获取text值 | —|
| setText | 设置text值 | text|
| getValue | 获取value值 | —|
|setValue| 设置value值| value|
| isEnabled | 是否可用 | —|
| isVisible | 是否可见 | —|
| disable | 设置组件不可用 | —|
| enable | 设置组件可用| —|
| valid | 设置组件有效| —|
|invalid | 设置组件无效 | —|
| invisible | 设置组件不可见 | —|
| visible | 设置组件可见 | —|
| isolate | | —|
| empty | 清空组件 | —|
| destroy | 销毁组件| —|





---


