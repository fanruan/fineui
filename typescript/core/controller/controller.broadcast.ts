import { Controller } from './controller';

export declare class BroadcastController extends Controller {
    on(name: string, fn: Function): Function;

    send(name: string, ...args: any[]): void;

    remove(name: string, fn?: Function): this;
}
