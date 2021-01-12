export declare type _EventListener = {
    listen: (target: EventTarget, eventType: string, callback: Function) => void;
    capture: (target: EventTarget, eventType: string, callback: Function) => void;
    registerDefault: () => void;
};
