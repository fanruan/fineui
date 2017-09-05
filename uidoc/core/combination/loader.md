# bi.loader

## 加载控件,[BI.Widget](/core/widget.md)


## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| direction | combo弹出层位置 | string | top,bottom,left,right,(top,left),(top,right),(bottom,left),(bottom,right) | "top"|
| isDefaultInit | 是否默认初始化子数据 |boolean | true,false | true |
| logic | | object | | {dynamic:true,scrolly:true} |
| items| | array | | []|
| itemsCreator | | function | | — |
| onLoaded | | function | | — |
| count | 是否显示总页数 | boolean| true,false|boolean|
| prev | 上一页 | boolean | true,false | boolean |
| next | 下一页 | boolean | true,false | boolean |
| hasPrev | 判断是否有上一页 | function | | — |
| hasNext | 判断是否有下一页 | function | | — |



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| hasNext | 判断是否有下一页 | — |
| prependItems | 内部前插入 | items |
| addItems | 内部后插入 | items |
| populate | 刷新列表 | items |
| setNotSelectedValue| 设置未被选中的值 | value,可以是单个值也可以是个数组|
| setValue | 设置value值 | value,可以是单个值也可以是个数组 |
| getNotSelectedValue | 获取没有被选中的值 | —|
| getValue | 获取被选中的值 |—|
| getAllButtons | 获取所有button |—|
| getAllLeaves | 获取所有的叶子节点 | —|
| getSelectedButtons | 获取所有被选中的元素 | —|
| getNotSelectedButtons | 获取所有未被选中的元素 | —|
| getIndexByValue | 根据value值获取value在数组中的索引 | value|
| getNodeById | 根据id获取节点 | id |
| getNodeByValue | 根据value值获取节点 | value |
| empty| 清空组件|—|
| destroy| 销毁组件|—|



---


