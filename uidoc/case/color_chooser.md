# bi.color_chooser

### 选色控件

{% method %}
[source](https://jsfiddle.net/fineui/7skvd64L/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.vertical",
    element: "#wrapper",
    items: [{
        type: "bi.label",
        height: 30,
        text: "默认风格"
    }, {
        type: "bi.segment",
        items: [{
            text: "tab1",
            value: 1,
            selected: true
        }, {
            text: "tab2",
            value: 2
        }, {
            text: "tab3 disabled",
            disabled: true,
            value: 3
        }]
    }],
    hgap: 50,
    vgap: 20
});

```

{% endmethod %}