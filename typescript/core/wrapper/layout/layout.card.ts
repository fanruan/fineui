import { Widget } from "../../widget";
import { Layout } from "../layout";

export declare class CardLayout extends Layout {
    static xtype: string;

    empty(): void;

    isCardExisted(cardName: string): boolean;

    getCardByName<T>(name: string):T;

    deleteCardByName(cardName: string): void;

    addCardByName(cardName: string, cardItem: any): Widget

    showCardByName(cardName: string, action?: any, callback?: () => void): void;

    showLastCard(): void;

    setDefaultShowName(name: string): void;

    getDefaultShowName(): string;

    getAllCardNames(): string[];

    getShowingCard<T>(): T;

    deleteAllCard(): void;

    hideAllCard(): void;

    isAllCardHide(): boolean;

    removeWidget(nameOrWidget: string | Widget): void;
}
