# relation_view

## 关联视图

{% method %}
[source](https://jsfiddle.net/fineui/k19mvL7q/)

{% common %}
```javascript
BI.createWidget({
    type: "bi.relation_view",
    items: [{
                primary: {
                     region: "B", regionText: "比",
                     title: "b2...",
                     value: "b2", text: "b2字段"
                },
                foreign: {region: "C", value: "c1", text: "c1字段"}
             }, {
                  primary: {region: "A", value: "a1", text: "a1字段"},
                  foreign: {region: "C", value: "c2", text: "c2字段"}
             }]
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|



---