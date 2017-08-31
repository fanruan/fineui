# bi.horizontal

#### 水平流式布局

{% method %}
[source](https://jsfiddle.net/fineui/oj7y7q3o/)

{% common %}
```javascript

BI.createWidget({
    type: 'bi.horizontal',
    element: "#wrapper",
    items: [{
        type: "bi.absolute",
        items: [{
            el: {
                type: "bi.text_button",
                cls: "layout-bg1",
                text: "这里设置了lgap,rgap,tgap,bgap",
                height: 30
            },
            left: 0,
            right: 0
        }],
        width: 100,
        height: 30
    }, {
        type: "bi.absolute",
        items: [{
            el: {
                type: "bi.text_button",
                cls: "layout-bg2",
                text: "这里设置了lgap,rgap,tgap,bgap",
                height: 30
            },
            left: 0,
            right: 0
        }],
        width: 200,
        height: 30
    }]
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
| items | 子控件数组     |    array |  |  |
| columnSize | 每列宽度所组成的数组     |    array |  |  |
| verticalAlign | 元素的垂直对齐方式     |    string |  | "middle" |
| scrollx | 设置水平方向是否有滚动条     |    boolean | true,false | true |

---