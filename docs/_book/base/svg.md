# bi.svg

## svg绘图,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/1xn8snp3/)

{% common %}
```javascript

var svg = BI.createWidget({
    type: "bi.svg",
    width: 500,
    height: 600
});

svg.path("M10,10L50,50M50,10L10,50")
    .attr({stroke: "red"});


```

{% endmethod %}


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| add | 添加对象到json数组 | json |
| path | 绘制路径 | pathString |
| image | 绘制图片 | (src,x,y,w,h)分别表示图片路径，绘制的原点横、纵坐标，宽、高 |
| rect |  绘制矩形 |  (x,y,w,h,r)分别表示左上角的横坐标、纵坐标，矩形宽、高、以及矩形的圆角border-radius大小|
| circle |  绘制圆形 | (x,y,r)分别表示原点的横坐标，纵坐标，以及半径 |
| ellipse | 绘制椭圆 |(x,y,rx,ry)分别表示原点的横、纵坐标，以及水平半径和垂直半径|
| text | 绘制文本 | (x,y,text)分别表示绘制的原点横、纵坐标以及要绘制的文本内容|
| print | 根据制定参数打印出路径 | (x, y, string, font, size, origin, letter_spacing, line_spacing) |
| setStart | 开始绘制 | — |
| setFinish | 结束绘制 | — |
| setSize | 设置画布尺寸 | (width,height)分别表示画布宽高|
| setViewBox |  设置画布可视区域 |  (x,y,width,height,fit)分别表示可视区域原点坐标以及可视区域宽高，以及是否根据可视区域进行调整 |
| getById |  根据id返回元素 | id |
| getElementByPoint | 获根据给定的点坐标返回元素 | (x,y)|
| getElementsByPoint | 获根据给定的点坐标返回元素 | (x,y) |
| getFont | 通过给定的参数在已注册的字体中找到字体对象 | (family, weight, style, stretch) |
| set | 绘制形状的集合 | — |
| remove | 设置总页数 | pages |
| clear | 判断是否有上一页 |  v |


 


---


