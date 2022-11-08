import { Change, Host } from '@schematics/angular/utility/change';
export declare class ReplaceChange implements Change {
    path: string;
    private pos;
    private end;
    private newText;
    order: number;
    description: string;
    constructor(path: string, pos: number, end: number, newText: string);
    apply(host: Host): Promise<void>;
}
