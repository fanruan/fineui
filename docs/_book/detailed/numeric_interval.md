# numeric_interval

## 数值区间控件

{% method %}
[source](https://jsfiddle.net/fineui/oskypvLe/)

{% common %}
```javascript
BI.createWidget({
    type: "bi.numerical_interval",
    element: '#wrapper',
    width: 500
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|
| min  |   最小值初始值 |  number |       |   无    |
| max  |   最大值初始值 |  number |       |   无    |
| closeMin  |   左区间初始状态 |  boolean |       |   true    |
| closeMax  |   右区间初始状态 |  boolean |       |   true    |

## 方法
| 方法                          | 说明               | 用法                                   |
| ---------------------------- | ---------------- | ------------------------------------ |
| isStateValid()                       | 当前状态是否有效(输入是否合法, 区间是否成立)             |    |
| setMinEnable(boolean)                       | 设置左区间输入框disable状态             |    |
| setCloseMinEnable(boolean)                       | 设置左区间开闭combo的disable状态             |    |
| setMaxEnable(boolean)                       | 设置右区间输入框disable状态             |    |
| setCloseMaxEnable(boolean)                       | 设置右区间开闭combo的disable状态             |    |
| setNumTip(string)                       | 设置数值区间的tip提示             |  —  |

##事件
| 事件    | 说明           |
| :------ |:------------- |
|BI.NumericalInterval.EVENT_VALID| 区间合法的状态事件 |
|BI.NumericalInterval.EVENT_ERROR| 区间不合法的状态事件 |


---