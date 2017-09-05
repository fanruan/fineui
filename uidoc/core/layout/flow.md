# bi.flow

#### 靠左/右对齐的自由浮动布局

{% method %}
[source](https://jsfiddle.net/fineui/c761a856/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.center_adapt",
    element: "#wrapper",
    items: [{
        type: "bi.left",
        items: [{
            type: "bi.label",
            height: 30,
            text: "Left-1",
            cls: "layout-bg1",
            hgap: 20
        }, {
            type: "bi.label",
            height: 30,
            text: "Left-2",
            cls: "layout-bg2",
            hgap: 20
        }],
        hgap: 20,
        vgap: 20
    }, {
        type: "bi.right",
        items: [{
            type: "bi.label",
            height: 30,
            text: "Right-1",
            cls: "layout-bg3",
            hgap: 20
        }, {
            type: "bi.label",
            height: 30,
            text: "Right-2",
            cls: "layout-bg4",
            hgap: 20
        }],
        hgap: 20,
        vgap: 20
    }]
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
| items | 子控件数组     |    array | — | — | 



---