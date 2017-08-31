# horizontal_float

#### 浮动的水平居中布局

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
| hgap    | 效果相当于容器左右padding值    |    number  |  |  0  |
| vgap    | 效果相当于容器上下padding值    |    number  |  |  0  |
| lgap    | 效果相当于容器left-padding值   |    number  |  |  0  |
| rgap    | 效果相当于容器right-padding值  |    number  |  |  0  |
| tgap    | 效果相当于容器top-padding值    |    number  |  |  0  |
| bgap    | 效果相当于容器bottom-padding值 |    number  |  |  0  |
| items | 子控件数组     |    array |  |  | |


---