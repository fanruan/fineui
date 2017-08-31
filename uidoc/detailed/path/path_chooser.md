# path_chooser

## 路径选择

{% method %}
[source](https://jsfiddle.net/fineui/5519b4xo/)

{% common %}
```javascript
BI.createWidget({
    type: "bi.path_chooser",
    element: "#wrapper",
    items: [[{
        "region": "8c4460bc3605685e",
        "regionText": "采购订单XXX",
        "text": "ID",
        "value": "1"
    }, {
        "region": "0fbd0dc648f41e97",
        "regionText": "采购订单",
        "text": "学号",
        "value": "3"
    }, {
        "region": "c6d72d6c7e19a667",
        "regionText": "供应商基本信息",
        "text": "ID",
        "value": "5"
    }]]
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|
| items |二维数组,每个元素代表一条路径  | array| |  |
--- ---