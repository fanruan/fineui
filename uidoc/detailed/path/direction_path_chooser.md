# direction_path_chooser

## 带方向的路径选择

{% method %}
[source](https://jsfiddle.net/fineui/04h6gsps/)

{% common %}
```javascript
BI.createWidget({
    type: "bi.direction_path_chooser",
    element: "#wrapper",
    items: [[{
                "region": "合同信息",
                "text": "客户ID",
                "value": "defa1f7ba8b2684a客户ID"
            }, {
                "region": "客户信息",
                "text": "主键",
                "value": "1f4711c201ef1842",
                "direction": -1
            }, {
                "region": "合同的回款信息",
                "text": "合同ID",
                "value": "e351e9f1d8147947合同ID",
                "direction": -1
            }]]
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|
| items |二维数组,每个元素代表一条路径,相较于[path_chooser](path_chooser.md)多一个属性direction来指定方向  | array| |  |
--- ---