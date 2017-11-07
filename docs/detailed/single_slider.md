# bi.single_slider

## 数值滑块

{% method %}
[source](https://jsfiddle.net/fineui/k6svamdz/)

{% common %}
```javascript
var singleSlider = BI.createWidget({
    type: "bi.single_slider",
    element: "body",
    width: 200,
    height: 50,
    cls: "demo-slider"
});

singleSlider.setMinAndMax({
    min: 10,
    max: 100
});
singleSlider.setValue(30);
singleSlider.populate();

```

{% endmethod %}



##参数

| 参数   | 说明   | 类型     | 默认值  |
| ---- | ---- | ------ | ---- |



## 方法

| 方法名      | 说明   | 参数    |
| -------- | ---- | ----- |
| setMinAndMax | 设置最大值最小值     | {min: number, max: number} |
| getValue | 获得当前值     | —     |
| setValue | 设置当前值     | value |
| populate | 加载设置后的控件   |   —    |

------

