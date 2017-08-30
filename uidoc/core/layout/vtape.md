# bi.vtape

#### 垂直tape布局,两列定高,一列自适应

{% method %}
[source](https://jsfiddle.net/fineui/ufpnz53d/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.vtape",
  element: "#wrapper",         
  items : [
    {
      height: 100,
      el : {
        type : 'bi.label',
        text : '1',
        cls: "layout-bg1"
      }
    }, {
      height: 200,
      el : {
        type : 'bi.label',
        text : '2',
        cls: "layout-bg2"
      }
    }, {
      height: 'fill',
      el : {
        type : 'bi.label',
        text : '3',
        cls: "layout-bg3"
      }
    }
  ]
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



---