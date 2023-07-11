import { IBasicModel } from '../interfaces/models/basic.model';
export declare class BasicModel implements IBasicModel {
    __typename: string;
    __classname: string;
    static assign(target: object, source?: object): void;
    constructor(obj?: IBasicModel);
    toJSON(): object;
}
