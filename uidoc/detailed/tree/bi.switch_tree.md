# bi.switch_tree

### 可以单选多选切换的树，继承BI.Widget

{% method %}
[source](https://jsfiddle.net/fineui/crd4z1nd/)

{% common %}
```javascript
var items = [{
  id: -1,
  pId: -2,
  value: "根目录",
  text: "根目录"
}, {
  id: 1,
  pId: -1,
  value: "第一级目录1",
  text: "第一级目录1"
}, {
  id: 11,
  pId: 1,
  value: "第二级文件1",
  text: "第二级文件1"
}];

var tree = BI.createWidget({
  type: "bi.switch_tree",
  items: items,
});
```

{% endmethod %}

## 参数设置
| 参数    | 说明            | 类型    | 默认值  |
| ----- | ------------- | ----- | ---- |
| items | 子项，pId代表父节点ID | array | []   |

## 方法
| 方法名          | 说明        | 参数           |
| ------------ | --------- | ------------ |
| switchSelect | 切换树结构     | — |
| setSelect    | 设置选中项     | v |
| getSelect    | 获取选中项     | —  |
| setValue     | 设置当前选中项内容 | v  |
| getValue     | 获取当前选中项内容 | v  |
| populate     | 更改树结构内容      | items  |

------



