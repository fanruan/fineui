# bi.bubble

#### 气泡提示

{% method %}
[source](https://jsfiddle.net/fineui/4u705v2v/)

{% common %}
```javascript

BI.createWidget({
  type: 'bi.bubble',
  element: "#wrapper",
  height: 30,
  text: "测试"
})

```

{% endmethod %}


## API
##### 基础属性

| 参数        | 说明            | 类型    | 可选值 | 默认值
| :------     |:-------------   | :-----  | :----  |:----
| direction   | 气泡显示位置    | string  |        |  "top"  |
| height      | 气泡高度        | number  |        | 35      |
| text        | 气泡显示内容    | string  |        | " "     |



## 对外方法
| 名称     | 说明          |  回调参数     
| :------  |:------------- | :-----   
| setText  | 设置文本值    | 需要设置的文本值text|

---
---