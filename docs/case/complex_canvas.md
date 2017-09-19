# complex_canvas

## 复杂的canvas绘图

{% method %}
[source](https://jsfiddle.net/fineui/psozjkgn/)

{% common %}
```javascript

var canvas = BI.createWidget({
   type: "bi.complex_canvas",
        width: 500,
        height: 600
    });
canvas.branch(55, 100, 10, 10, 100, 10, 200, 10, {
     offset: 20,
     strokeStyle: "red",
     lineWidth: 2
 });

canvas.stroke();


```

{% endmethod %}

## 对外方法
| 名称     | 说明                           |  回调参数
| :------ |:-------------                  | :-----
| branch | 绘制树枝节点| (x0, y0, x1, y1, x2, y2) （以x0, y0为根节点，分支到x1,y1, x2,y2...）|
| stroke | 绘制 |  |

---


