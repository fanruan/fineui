# bi.level_tree

### 二级树

{% method %}
[source](https://jsfiddle.net/fineui/nvvkwhfo/)

{% common %}
```javascript
var tree = BI.createWidget({
  type: "bi.level_tree",
  element: 'body',
  items: [],
});
```

{% endmethod %}



### 参数设置

| 参数       | 说明                | 类型     | 默认值  |
| -------- | ----------------- | ------ | ---- |
| expander | branch_expander配置 | object | {}   |
| items    | 元素                | array  | []   |



### 方法

| 方法名            | 说明       | 参数        |
| -------------- | -------- | ----------- |
| initTree       | 构造树结构    | nodes       |
| stroke         | 生成树方法    | nodes       |
| populate       | 去掉所有内容     | items: 子项数组 |
| setValue       | 设置值      | v           |
| getValue       | 获得值      | —           |
| getAllLeaves   | 获取所有叶节点  | —           |
| getNodeById    | 根据Id获取节点 | id          |
| getNodeByValue | 根据值获取节点  | id          |

------