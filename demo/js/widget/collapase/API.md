## API

### bi.collapse

| 参数       | 说明       | 类型    | 默认值               |
| ---------- | ---------- | ------- | -------------------- |
| accordion  | 手风琴模式 | boolean | false                |
| bordered | 带边框风格的折叠面板 | boolean | true |
| ghost | 使折叠面板透明且无边框 | boolean | false |
| openMotion | 展开动画   | object  | { animation: "bi-slide-up", animationDuring: 100}
| value | 初始化选中面板的 key | string\[] <br/> number\[] | - |
| listeners | 监听切换面板事件 | [{eventName: "EVENT_EXPAND", action:(activeKey) => void}] | - |
