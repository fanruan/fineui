# bi.grid

#### 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应

{% method %}
[source](https://jsfiddle.net/fineui/1gwjbpL6/)

{% common %}
```javascript

BI.createWidget({
    type: 'bi.grid',
    element: "#wrapper",
    columns: 2,
    rows: 2,
    items: [{
        column: 0,
        row: 0,
        el: {
            type: "bi.label",
            text: "column-0, row-0",
            cls: "layout-bg1"
        }
        }, {
        column: 1,
        row: 0,
        el: {
            type: "bi.label",
            text: "column-1, row-0",
            cls: "layout-bg2"
        }
        }  {
        column: 0,
        row: 1,
        el: {
            type: "bi.label",
            text: "column-0, row-1",
            cls: "layout-bg5"
        }
        }, {
        column: 1,
        row: 1,
        el: {
            type: "bi.label",
            text: "column-1, row-1",
            cls: "layout-bg6"
        }
    }]
});





```

{% endmethod %}


## API
##### 基础属性

| 参数    | 说明                           | 类型       | 可选值 | 默认值
| :------ |:-------------                  | :-----     | :----|:----
| columns | 列的数量    |    number  |  |  null  |
| rows | 行的数量    |    number  |  |  null  |
| items | 子控件数组     |    array |  | [] |



---