# bi.horizontal_float

#### 浮动的水平居中布局，适用于宽度不定元素的水平居中

{% method %}
[source](https://jsfiddle.net/fineui/91rd0zpe/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.horizontal_float",
    element: "#wrapper",
    vgap: 10,
    items: [{
        type: "bi.label",
        text: "Horizontal Float左右自适应",
        cls: "layout-bg1",
        width: 200,
        height:30
    }]
})



```

{% endmethod %}


## API
##### 基础属性
| 参数    | 说明                           | 类型       | 可选值 | 默认值
| :------ |:-------------                  | :-----     | :----|:----


---