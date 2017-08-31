# bi.vertical

#### 垂直流式布局

{% method %}
[source](https://jsfiddle.net/fineui/zjyaz9fn/)

{% common %}
```javascript

BI.createWidget({
    type: 'demo.vertical',
    element: "#wrapper",
    items: [{
        type: "bi.label",
        cls: "layout-bg1",
        text: "这里设置了hgap(水平间距)，vgap(垂直间距)",
        height: 30
    }, {
        type: "bi.label",
        cls: "layout-bg2",
        text: "这里设置了hgap(水平间距)，vgap(垂直间距)",
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
| scrolly | 设置垂直方向是否有滚动条     |    boolean | true,false | true |

---