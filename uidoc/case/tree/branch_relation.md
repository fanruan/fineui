# bi.branch_relation

### 表关联树

{% method %}
[source](https://jsfiddle.net/fineui/z5hLcruk/)

{% common %}
```javascript
var tree = BI.createWidget({
  type: "bi.branch_relation",
  element: 'body',
  items: [],
  direction: BI.Direction.Right,
  align: BI.HorizontalAlign.Right,
  centerOffset: -50
});
```

{% endmethod %}



### 参数设置

| 参数           | 说明      | 类型     | 默认值                  |
| ------------ | ------- | ------ | -------------------- |
| centerOffset | 重心偏移量   | number | 0                    |
| direction    | 根节点所在方向 | string | BI.Direction.Bottom  |
| align        | 对齐方向    | string | BI.VerticalAlign.Top |
| items        | 元素      | array  | null                 |



### 方法

| 方法名      | 说明   | 回调参数        |
| -------- | ---- | ----------- |
| populate | 刷新内容 | items: 子项数组 |

