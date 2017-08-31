# file_manager

## 文件管理器

{% method %}
[source](https://jsfiddle.net/fineui/2g4k0kxh/)

{% common %}
```javascript
BI.createWidget({
    type: "bi.file_manager",
    items: [{
                id: "1",
                value: "1",
                text: "根目录"
              }, {
                id: "11",
                pId: "1",
                value: "11",
                text: "第一级子目录1"
              }, {
                id: "12",
                pId: "1",
                value: "12",
                text: "第一级子目录2"
              }]
})
```

{% endmethod %}

##参数

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|

--- ---

##方法

| 方法    | 说明           |
| :------ |:-------------  |
| getSelectedValue() |     获取当前选中项的value值             |
| getSelectedId |    获取当前选中项的id属性              |
--- ---