# bi.horizontal_auto

#### 水平方向居中容器，水平居中推荐使用这种布局

{% method %}
[source](https://jsfiddle.net/fineui/ej2j8umg/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.horizontal_auto",
    element: "#wrapper",
    vgap: 10,
    items: [{
        type: "bi.label",
        text: "Horizontal Auto左右自适应",
        cls: "layout-bg1",
        width: 300,
        height: 30
    }, {
        type: "bi.label",
        text: "Horizontal Auto左右自适应",
        cls: "layout-bg2",
        width: 300,
        height: 30
    }]
})


```

{% endmethod %}


## API
##### 基础属性
| 参数    | 说明                           | 类型       | 可选值 | 默认值
| :------ |:-------------                  | :-----     | :----|:----



---