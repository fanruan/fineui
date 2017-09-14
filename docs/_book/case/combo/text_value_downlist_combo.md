# bi.text_value_down_list_combo

## 有二级下拉菜单的combo 基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/xtxmfgx1/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.text_value_down_list_combo",
  element: "#wrapper",
  text: "text",
  items: [
    [{
      el: {
        text: "1",
        value: 1
      },
      children: [{
        text: "11",
        value: 11
      }]
    }],
    [{
      text: "2",
      value: 2
    }, {
      text: "3",
      value: 3
    }]
  ]
});



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| height | 高度 | number | — | 30
| text | 文本内容 | string | — | " " |

 


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| setValue| 设置value值|—|
| getValue| 获取value值|—|
| populate | 刷新列表 | items |





---


