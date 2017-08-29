## 各种节点nodes

{% method %}
[source](https://jsfiddle.net/fineui/jg257cog/)

{% common %}
```javascript
Demo = {};
Demo.Nodes = BI.inherit(BI.Widget, {

    render: function (vessel) {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "十字形的节点"
            }, {
                type: "bi.plus_group_node",
                text: "十字形的节点"
            }, {
                type: "bi.label",
                height: 30,
                text: "三角形的节点"
            }, {
                type: "bi.triangle_group_node",
                text: "三角形的节点"
            }, {
                type: "bi.label",
                height: 30,
                text: "箭头节点"
            }, {
                type: "bi.arrow_group_node",
                text: "箭头节点"
            }]
        }
    }
});

BI.shortcut("demo.nodes", Demo.Nodes);
BI.createWidget({
  type: 'demo.nodes',
  element: "#wrapper",
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| hgap    | 效果相当于文本框左右padding值，如果clear属性为true,该属性值置0 |  number  |     |     10   |
| vgap    | 效果相当于文本框上下padding值 |  number  |  |      0  |
| lgap    | 效果相当于文本框left-padding值     |    number   |        |  0    |
| rgap    | 效果相当于文本框right-padding值     |    number  |       |  0    |
| tgap    |效果相当于文本框top-padding值     |    number   |  |  0    |
| bgap    |  效果相当于文本框bottom-padding值     |    number  |   |  0    |
| items | 子控件数组     |    array |  |  |
| width    |   宽度    |    number   |   |     |
| height    |   高度    |    number   |  |      |


--- ---


