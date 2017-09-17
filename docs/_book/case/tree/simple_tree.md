# bi.simple_tree

### 简单的多选树

{% method %}
[source](https://jsfiddle.net/fineui/5qtobqxb/)

{% common %}
```javascript
var tree = BI.createWidget({
  type: "bi.simple_tree",
  element: 'body',
});

tree.populate(items);
```

{% endmethod %}



### 参数设置

| 参数           | 说明       | 类型       | 默认值        |
| ------------ | -------- | -------- | ---------- |
| itemsCreator | items构造器 | function | BI.emptyFn |
| items        | 元素       | array    | null       |



### 方法

| 方法名      | 说明   | 参数                           |
| -------- | ---- | ------------------------------ |
| populate | 去掉所有内容 | items: 子项数组 keywords: 关键字标红字符串 |
| setValue | 设置值  | v                              |
| getValue | 获得值  | —                              |
| empty    | 清空树  | —                              |

------