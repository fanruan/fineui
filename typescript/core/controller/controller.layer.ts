import { Controller } from './controller';

export declare class LayerController extends Controller {
    make<T>(name: string, op: any, context?: any): T;
    make<T>(name: string, container: any, op?: any, context?: any): T;

    create<T>(name: string, from?: any, op?: any, context?: any): T;

    hide(name: string, callback?: boolean): LayerController;

    show(name: string, callback?: boolean): LayerController;

    isVisible(name: string): boolean;

    add(name: string, layer: any, layout: any): LayerController;

    get<T>(name: string): T;

    has(name: string): boolean;

    remove(name: string): LayerController;

    removeAll(): LayerController;
}
