# bi.handstand_branch_tree
### 纵向分支的树

{% method %}
[source](https://jsfiddle.net/fineui/c2kaoc7x/)

{% common %}
```javascript
BI.createWidget({
  type: "bi.handstand_branch_tree",
  element: 'body',
  el: {},
  items: [{
    el: {},
    children: [{
        el: {},
        children: {},
        // ...
    }]
  }]
});
```

{% endmethod %}



### 参数设置

| 参数       | 说明                   | 类型     | 默认值  |
| -------- | -------------------- | ------ | ---- |
| expander | branch_expander组件配置项 | object | {}   |
| el       | 基础元素                     | object | {}   |
| items    | 子项                   | array  | []   |



### 方法

| 方法名      | 说明     | 参数 |
| -------- | ------ | ---- |
| populate | 去掉所有内容 | —    |
| getValue | 获取所选项值 | —    |

------

