# bi.display_tree

### 异步树控件

{% method %}
[source](https://jsfiddle.net/fineui/cfL6fpa1/)

{% common %}
```javascript
var tree = BI.createWidget({
  type: "bi.display_tree",
  element: 'body',
});

tree.initTree({
    id: 1,
    text: '',
    open: true,
});
```

{% endmethod %}



### 参数设置

| 参数       | 说明                   | 类型     | 默认值  |
| -------- | -------------------- | ------ | ---- |
| — | — | — | —   |



### 方法

| 方法名      | 说明     | 回调参数 |
| -------- | ------ | ---- |
| initTree | 加载tree结构 | node: 节点数组 settings: 配置项    |
| destroy | 摧毁元素 | —    |



