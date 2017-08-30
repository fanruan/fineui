# bi.float_center

#### 浮动布局实现的居中容器

{% method %}
[source](https://jsfiddle.net/fineui/1vgn555m/)

{% common %}
```javascript

BI.createWidget({
    type: 'bi.float_center',
    element: "#wrapper",
    items: [{
        type: "bi.label",
        text: "floatCenter与center的不同在于，它可以控制最小宽度和最大宽度",
        cls: "layout-bg1",
        whiteSpace: "normal"
    }, {
        type: "bi.label",
        text: "floatCenter与center的不同在于，它可以控制最小宽度和最大宽度",
        cls: "layout-bg2",
        whiteSpace: "normal"
    }],
    height: 300,
    hgap: 20,
    vgap: 20
});


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