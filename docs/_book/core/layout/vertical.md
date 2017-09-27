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
| scrolly | 设置垂直方向是否有滚动条     |    boolean | true,false | true |

---