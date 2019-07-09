export declare class _OB {
    protected props: Props | (<T>(config: T) => Props & T);

    protected options: Props;

    private events?: {
        [eventName: string]: Function[];
    };

    public init: Function | null;

    public destroyed: Function | null;

    protected _defaultConfig: (..._args: any[]) => { [key: string]: any } | {};

    protected _init: () => void;

    private _initListeners: () => void;

    private _getEvents: () => { [eventName: string]: Function[] };

    public on: (eventName: string, fn: Function) => void;

    public once: (eventName: string, fn: Function) => void;

    public un: (eName: string, fn: Function) => void;

    protected _initRef: () => void;

    protected _purgeRef: () => void;

    public purgeListeners: () => void;

    public fireEvent: (eName: string, ...args: any[]) => boolean;

    public destroy: () => void;
}

interface Props {
    listeners?: {
        eventName: string;
        action: (...args: any[]) => any;
        target?: _OB;
        once?: boolean;
    }[];
    [key: string]: any;
}