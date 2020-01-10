export interface _OB {
    props: Props | (<T>(config: T) => Props & T);
    options: this["props"];
    events?: {
        [eventName: string]: Function[];
    };
    init?(): void;
    destroyed?(): void;
    _defaultConfig(..._args: any[]): {
        [key: string]: any;
    } | {};
    _init(): void;
    _initListeners(): void;
    _getEvents(): {
        [eventName: string]: Function[];
    };
    on(eventName: string, fn: Function): void;
    once(eventName: string, fn: Function): void;
    un(eName: string, fn: Function): void;
    _initRef(): void;
    _purgeRef(): void;
    purgeListeners(): void;
    fireEvent(eName: string, ...args: any[]): boolean | null;
    destroy(): void;
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
export {};
