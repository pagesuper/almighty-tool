import _ from 'lodash';
import { IBasicModel } from '../interfaces/models/basic.model';

export class BasicModel implements IBasicModel {
  __typename = BasicModel.name;
  __classname = BasicModel.name;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static assign(target: object, source?: object) {
    if (source) {
      Object.assign(
        target,
        _.pickBy(source, (value) => {
          return typeof value !== 'undefined';
        }),
      );
    }
  }

  constructor(obj?: IBasicModel) {
    BasicModel.assign(this, obj);
  }

  public toJSON(): object {
    return Object.assign({}, this, {});
  }
}
