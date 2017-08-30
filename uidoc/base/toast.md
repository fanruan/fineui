# bi.toast

#### toast提示

{% method %}
[source]()

{% common %}
```javascript

BI.createWidget({
  type: 'bi.toast',
  element: "#wrapper",
  height: 30,
  level: "warning",
  text: "toast测试"
})


```

{% endmethod %}


## API
##### 基础属性

| 参数        | 说明            | 类型    | 可选值 | 默认值
| :------     |:-------------   | :-----  | :----  |:----
| level       | 提示类型    |    string | success,warning |  "success"  |
| height      | 高度        | number  |        | 30      |
| text        | 显示内容    | string  |        | " "     |



## 对外方法
| 名称     | 说明          |  回调参数     
| :------  |:------------- | :-----   
| setText  | 设置文本值    | 需要设置的文本值text     |
| setHeight  | 设置高度    | 需要设置的高度值height   |

---
