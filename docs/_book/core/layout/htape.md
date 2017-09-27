# bi.htape

#### 水平tape布局,n列定宽,一列自适应

{% method %}
[source](https://jsfiddle.net/fineui/ry7Lnhgw/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.htape",
  element: "#wrapper",         
  items : [
    {
      width: 100,
      el : {
        type : 'bi.label',
        text : '1',
        cls: "layout-bg1"
      }
    }, {
      width: 200,
      el : {
        type : 'bi.label',
        text : '2',
        cls: "layout-bg2"
      }
    }, {
      width: 'fill',
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
| items | 子控件数组     |    array | — | [{width: 100,el: {type: 'bi.button', text: 'button1'}},{width: 'fill',el: {type: 'bi.button', text: 'button2'}},{width: 200,el: {type: 'bi.button', text: 'button3'}}] |



---