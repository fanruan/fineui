# bi.canvas

## canvas绘图,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/gcgd1va0/)

{% common %}
```javascript

var canvas = BI.createWidget({
   type: "bi.canvas",
   element: "#wrapper",
   width: 500,
   height: 600
});
canvas.circle(150, 50, 20, "green");
canvas.stroke();


```

{% endmethod %}


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----
| line | 绘制线段| (x0, y0, x1, y1) |
| rect |  绘制矩形 |  (x,y,w,h,color)分别表示左上角的横坐标、纵坐标，矩形宽、高、以及绘制的颜色|
| circle |  绘制圆形 | (x, y, radius, color)分别表示原点的横坐标，纵坐标，半径以及颜色 |
| hollow | 填充中空的路径 |  |
| solid | 填充实心的路径 |  |
| gradient | 绘制渐变色 | (x0, y0, x1, y1, start, end) |
| reset | 重置画布 | —|
| stroke | 绘制 | callback |

---


