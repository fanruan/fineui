# bi.multi_tree_combo

### 树下拉框

{% method %}
[source](https://jsfiddle.net/fineui/caw7efpf/)

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

BI.createWidget({
  type: "bi.horizontal_auto",
  element: "body",
  items: [{
  	type: "bi.multi_tree_combo",
    ref: function (_ref) {
      self.tree = _ref;
    },
    itemsCreator: function (options, callback) {
      console.log(options);
      
      callback({
        items: items
      });
    },
    width: 300
  }, {
  	type: "bi.button",
    text: "getVlaue",
    handler: function () {
      BI.Msg.toast(JSON.stringify(self.tree.getValue()));
    },
    width: 300
  }]
})
```

{% endmethod %}

## 参数设置
| 参数    | 说明            | 类型    | 默认值  |
| ----- | ------------- | ----- | ---- |
| items | 子项，pId代表父节点ID | array | []   |

## 方法
### 通用方法参见[Tree](#)方法