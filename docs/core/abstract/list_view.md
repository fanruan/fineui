# list_view

## 优化过性能的列表,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/ueutn0sj/)

{% common %}
```javascript

BI.createWidget({
   type: "bi.list_view",
   el: {
        type: "bi.left"
   },
   items: []
});



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| overscanHeight | 超出可视范围区域多少高度预加载 | number | —  | 100 |
| blockSize | 块大小以多少项为单位 | number | - | 0 |



## 对外方法
| 名称     | 说明                           |  回调参数
| :------ |:-------------                  | :-----
| populate | 刷新列表 | items |



---