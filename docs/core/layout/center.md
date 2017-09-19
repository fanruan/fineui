# bi.center

#### 水平和垂直方向都居中容器, 非自适应，用于宽度高度固定的面板

{% method %}
[source](https://jsfiddle.net/fineui/8fd2nvkm/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.center",
    element: "#wrapper",
    items: [{
        type: "bi.label",
        text: "Center 1，这里虽然设置label的高度30，但是最终影响高度的是center布局",
        cls: "layout-bg1",
        whiteSpace: "normal"
    },{
        type: "bi.label",
        text: "Center 2，为了演示label是占满整个的，用了一个whiteSpace:normal",
        cls: "layout-bg2",
        whiteSpace: "normal"
    }],
    hgap: 20,
    vgap: 20
});


```

{% endmethod %}


## API
##### 基础属性
| 参数    | 说明                           | 类型       | 可选值 | 默认值
| :------ |:-------------                  | :-----     | :----|:----
| hgap    | 效果相当于容器左右padding值    |    number  | — |  0  |
| vgap    | 效果相当于容器上下padding值    |    number  | — |  0  |
| lgap    | 效果相当于容器left-padding值   |    number  | — |  0  |
| rgap    | 效果相当于容器right-padding值  |    number  | — |  0  |
| tgap    | 效果相当于容器top-padding值    |    number  | — |  0  |
| bgap    | 效果相当于容器bottom-padding值 |    number  | — |  0  |


---