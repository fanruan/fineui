# bi.expander

## 某个可以展开的节点,基类[BI.Widget](/core/widget.md)


## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| trigger | 事件类型 | string |  | "click" |
| toggle | 切换状态 | boolean | true,false | true |
| direction | combo弹出层位置 | string | top,bottom,left,right,(top,left),(top,right),(bottom,left),(bottom,right) | "bottom"|
| isDefaultInit | 是否默认初始化子节点 |boolean | true,false | false |
| el | 开启弹出层的元素 | object | — |{ }|
| popup | 弹出层 | object | — | { }|
| expanderClass | | string | | "bi-expander-popup" |
| hoverClass | | string | | "bi-expander-hover" |



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| populate | 刷新列表 | items  |
| setValue | 设置combo value值| v |
| getValue | 获取combo value值 | —|
| isViewVisible | 弹窗层是否可见 | —|
| showView | ||
| hideView |||
| getView |||
| getAllLeaves | 获取所有的叶子节点 | —|
| getNodeById | 根据id获取节点 | id |
| getNodeByValue | 根据value值获取节点 | value |
| isExpanded |  节点是否展开 | |
| destroy | 销毁组件| — |


---


