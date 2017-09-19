
# bi.left_right_vertical_adapt

#### 左右分离,垂直方向居中容器

{% method %}
[source](https://jsfiddle.net/fineui/2udhep9z/)

{% common %}
```javascript

BI.createWidget({
    type: 'bi.left_right_vertical_adapt',
    element: "#wrapper",
    lhgap: 10,
    rhgap: 10,
    items: {
        left: [{
            type: "bi.label",
            text: "左边的垂直居中",
            cls: "layout-bg1",
            width: 100,
            height: 30
        }],
        right: [{
            type: "bi.label",
            text: "右边的垂直居中",
            cls: "layout-bg1",
            width: 100,
            height: 30
        }]
    }
});



```

{% endmethod %}


## API
##### 基础属性
| 参数    | 说明                           | 类型       | 可选值 | 默认值
| :------ |:-------------                  | :-----     | :----|:----
| lhgap | 左边容器左右padding值    |    number  | — |  0  |
| lrgap | 左边容器right-padding值    |    number  | — |  0  |
| llgap | 左边容器left-padding值   |    number  | — |  0  |
| rhgap | 右边容器左右padding值  |    number  | — |  0  |
| rrgap | 右边容器right-padding值    |    number  | — |  0  |
| rhgap | 右边容器left-padding值 |    number  | — |  0  |
| items | 子控件数组     |    array | — | [ ] |


---