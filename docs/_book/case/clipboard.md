# bi.clipboard

### 剪切板

{% method %}
[source](https://jsfiddle.net/fineui/kLzq99c3/)

{% common %}
```javascript

BI.createWidget({
    type: 'bi.clipboard',
    width: 100,
    height: 100,
    copy: function () {},

    afterCopy: function () {}
});

```

{% endmethod %}



### 参数

| 参数        | 说明         | 类型       | 默认值        |
| --------- | ---------- | -------- | ---------- |
| copy      | 获取需要拷贝的值   | function | BI.emptyFn |
| afterCopy | 完成拷贝后执行的方法 | function | BI.emptyFn |

------