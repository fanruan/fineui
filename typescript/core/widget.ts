import { _OB } from "./ob";


export declare class _Widget extends _OB {
    /**
     * 出现loading的锁
     */
    protected __asking: boolean;
    /**
     * 同步锁
     */
    protected __async: boolean;
    /**
     * widget类标识符
     */
    public widgetName: string | null;
    /**
     * 是否为根节点
     */
    private _isRoot: boolean;
    /**
     * 父节点
     */
    private _parent: _Widget | null;
    // TODO: 完成jquery文件夹后把这块改了
    /**
     * 真实dom的类jQuery对象
     */
    public element: any;
    /**
     * 子元素
     */
    public _children: {
        [key: string]: _Widget;
    };
    /**
     * 是否已挂载
     */
    private _isMounted: boolean;
    /**
     * 手动设置enable
     */
    private _manualSetEnable: boolean;
    /**
     * 手动设置valid
     */
    private _manualSetValid: boolean;
    /**
     * 渲染引擎
     */
    public _renderEngine: RenderEngine;

    private _store: () => any;

    private model: any;

    // 生命周期函数
    /**
     * 初始化前
     */
    public beforeInit: Function | null;
    
    /**
     * 创建前
     */
    public beforeCreate: Function | null;

    /**
     * 创建
     */
    public created: Function | null;

    /**
     * 渲染
     */
    public render: Function | null;

    /**
     * 挂载前
     */
    public beforeMount: Function | null;

    /**
     * 挂载
     */
    public mounted: Function | null;

    /**
     * 更新前
     */
    public shouldUpdate: Function | null;

    /**
     * 更新
     */
    public update: Function;

    /**
     * 销毁前
     */
    public beforeDestroy: Function | null;

    /**
     * 销毁
     */
    public destroyed: Function | null;

    /**
     * 初始化render函数
     */
    private _initRender: () => void;

    /**
     * 内部主render函数
     */
    private _render: () => void;

    /**
     * 初始化根节点
     */
    private _initRoot: () => void;

    /**
     * 初始化元素宽度
     */
    private _initElementWidth: () => void;

    /**
     * 初始化元素高度
     */
    private _initElementHeight: () => void;

    /**
     * 初始化元素可见
     */
    private _initVisual: () => void;

    /**
     * 初始化元素可用不可用
     */
    private _initEffects: () => void;

    /**
     * 设置mounted锁
     */
    private _initState: () => void;

    /**
     * 生成真实dom
     */
    private _initElement: () => void;

    /**
     * 设置父节点
     */
    private _setParent: () => void;

    /**
     * @param force 是否强制挂载子节点
     * @param deep 子节点是否也是按照当前force处理
     * @param lifeHook 生命周期钩子触不触发，默认触发
     * @param predicate 递归每个widget的回调
     */
    public _mount: (force?: boolean, deep?: boolean, lifeHook?: boolean, predicate?: Function) => boolean;

    /**
     * 挂载子节点
     */
    private _mountChildren: Function | null;

    /**
     * 是否已挂载
     */
    public isMounted: () => boolean;

    /**
     * 设置宽度
     */
    public setWidth: (w: number) => void;

    /**
     * 设置高度
     */
    public setHeight: (h: number) => void;

    /**
     * 设置可用
     */
    private _setEnable: (enable: boolean) => void;

    /**
     * 设置合法
     */
    private _setValid: (valid: boolean) => void;

    /**
     * 设置可见
     */
    private _setVisible: (visible: boolean) => void;

    /**
     * 设置是否可用
     */
    public setEnable: (enable: boolean) => void;

    /**
     * 设置是否可见
     */
    public setVisible: (visible: boolean) => void;

    /**
     * 设置是否合法
     */
    public setValid: (valid: boolean) => void;

    /**
     * 设置反馈效果
     * @param args arguments参数
     */
    public doBehavior: (...args: any[]) => void;

    /**
     * 获取宽度
     */
    public getWidth: () => number;

    /**
     * 获取高度
     */
    public getHeight: () => number;

    /**
     * 是否合法
     */
    public isValid: () => boolean;

    /**
     * 新增子元素
     */
    public addWidget: (_name: any, _widget: _Widget) => _Widget;

    /**
     * 根据wigetname获取子元素实例
     */
    public getWidgetByName: (_name: string) => _Widget;

    /**
     * 移除子元素
     * @param nameOrWidget widgetName或widget实例
     */
    public removeWidget: (nameOrWidget: string | _Widget) => void;

    /**
     * 是否有某个子元素
     */
    public hasWidget: (name: string) => boolean;

    /**
     * 获取widgetName
     */
    public getName: () => string;

    /**
     * 设置tag
     * @param tag html tag
     */
    public setTag: (tag: string) => void;

    /**
     * 获取tag
     */
    public getTag: () => string;

    /**
     * 设置属性
     * @param key 键
     * @param value 值
     */
    public attr: (key: string | { [key: string]: any }, value: any) => any;

    /**
     * 获取text
     */
    public getText: () => string;

    /**
     * 设置text
     */
    public setText: () => void;

    /**
     * 获取值
     */
    public getValue: () => any;

    /**
     * 设置值
     */
    public setValue: (...args: any[]) => void;

    /**
     * 获取是否enable
     */
    public isEnabled: () => boolean;

    /**
     * 是否可见
     */
    public isVisible: () => boolean;

    /**
     * disable元素
     */
    public disable: ()=> void;

    /**
     * enable元素
     */
    public enable: () => void;

    /**
     * 是widget合法
     */
    public valid: () => void;

    /**
     * 使元素不合法
     */
    public invalid: () => void;

    /**
     * 使不可见
     */
    public invisible: () => void;

    /**
     * 可见
     */
    public visible: () => void;

    /**
     * 清除子元素
     */
    private __d: () => void;

    /**
     * 取消挂载
     */
    private _unMount: () => void;

    /**
     * hang元素
     */
    public isolate: () => void;

    /**
     * 请除元素
     */
    public empty: () => void;

    /**
     * 内部destory方法
     */
    protected _destroy: () => void;

    /**
     * destory元素
     */
    public destroy: () => void;

    /**
     * 注册渲染引擎
     * @param engine 引擎
     */
    static registerRenderEngine: (engine: RenderEngine) => void;
}

interface RenderEngine {
    // TODO: 完成jquery文件夹后把这块改了
    /**
     * 创建元素方法，返回的类jQuery对象
     * @param widget widget对象
     */
    createElement: (widget: any) => any;
    /**
     * 创建DocumentFragment对象
     */
    createFragment: () => DocumentFragment;
}
