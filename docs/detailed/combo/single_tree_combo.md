# bi.single_tree_combo

### 二级树下拉框

{% method %}
[source](https://jsfiddle.net/fineui/oxkb9uw5/)

{% common %}
```javascript
var tree = BI.createWidget({
  type: "bi.single_tree_combo",
  element: 'body',
  items: [],
  text: "默认值",
  width: 300,
});
```

{% endmethod %}



### 参数设置

| 参数      | 说明   | 类型     | 默认值  |
| ------- | ---- | ------ | ---- |
| trigger | 下拉列表的弹出方式  | object | {}   |
| height  | 高度   | number | 30   |
| text    | 文本框值 | string | ''   |
| items   | 元素   | array  | null |



### 方法

| 方法名      | 说明   | 参数        |
| -------- | ---- | ----------- |
| populate | 刷新内容 | items: 子项数组 |
| setValue | 设置值  | setValue    |
| getValue | 获取值  | getValue    |


## 事件
| 事件    | 说明           |
| :------ |:------------- |
|BI.SingleTreeCombo.EVENT_BEFORE_POPUPVIEW| 下拉框弹出前触发 |
其他事件详见[Input](../../base/editor/editor.md)


---

