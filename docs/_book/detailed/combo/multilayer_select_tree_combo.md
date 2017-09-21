# bi.multilayer_select_tree_combo

### 多层级下拉可选节点树

{% method %}
[source](https://jsfiddle.net/fineui/ryo1cnrL/)

{% common %}
```javascript
var tree = BI.createWidget({
  type: "bi.multilayer_select_tree_combo",
  element: 'body',
  items: [],
  text: "默认值",
  width: 300,
});
```

{% endmethod %}



### 参数设置

| 参数     | 说明   | 类型     | 默认值  |
| ------ | ---- | ------ | ---- |
| height | 高度   | number | 30   |
| text   | 文本框值 | string | ''   |
| items  | 元素   | array  | null |



### 方法

| 方法名      | 说明   | 回调参数        |
| -------- | ---- | ----------- |
| populate | 刷新内容 | items: 子项数组 |
| setValue | 设置值  | setValue    |
| getValue | 获取值  | getValue    |

------