# bi.multi_tree_combo

### 树下拉框，继承BI.Widget

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
  type: "bi.multi_tree_combo",
  itemsCreator: function (options, callback) {
        callback({
          items: items
        });
  },
  width: 300
})
```

{% endmethod %}

## 参数设置
| 参数           | 说明            | 类型       | 默认值           |
| ------------ | ------------- | -------- | ------------- |
| width        | 宽度            | number   | 200           |
| height       | 高度            | number   | 30            |
| items        | 子项，pId代表父节点ID | array    | null          |
| itemsCreator | 子项创建函数        | function | function() {} |

## 方法
| 方法名      | 说明      | 用法              |
| -------- | ------- | --------------- |
| setValue | 设置文本框值  | setValue(v)     |
| getValue | 获取文本框值  | getValue()      |
| populate | 更改树结构内容 | populate(items) |

##
BI.MultiTreeCombo.EVENT_CONFIRM

