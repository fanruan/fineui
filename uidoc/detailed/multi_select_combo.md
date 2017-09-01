# multi_select_combo

## 带确定的复选下拉框

{% method %}
[source](https://jsfiddle.net/fineui/oskypvLe/)

{% common %}
```javascript
BI.createWidget({
    type: "bi.multi_select_combo",
    element: '#wrapper',
    width: 500,
    itemsCreator: function(){
        return {
            items: [],
            hasNext: false
        }
    }
});
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|

## 方法
| 方法                          | 说明               | 用法                                   |
| ---------------------------- | ---------------- | ------------------------------------ |   |

| 事件    | 说明           |
|BI.MultiSelectCombo.EVENT_CONFIRM| 点击确定触发 |