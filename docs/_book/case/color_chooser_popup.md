# bi.color_chooser_popup

### 选色控件弹窗

{% method %}
[source](https://jsfiddle.net/fineui/xL7moydu/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.color_chooser_popup",
});

```

{% endmethod %}



### 参数

| 参数     | 说明   | 类型     | 默认值  |
| ------ | ---- | ------ | ---- |
| height | 高度   | number | 145  |



### 方法

| 方法名            | 说明       | 参数     |
| -------------- | -------- | ------ |
| setStoreColors | 设置储存的颜色值 | colors |
| setValue       | 设置颜色值    | color  |
| getValue       | 获取颜色值    | —      |



### 事件

| 事件                 | 说明       |
| ------------------ | -------- |
| EVENT_VALUE_CHANGE | 颜色值改变时触发 |

------