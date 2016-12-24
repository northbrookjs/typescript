// tslint:disable-next-line
import { NorthbrookConfig } from 'northbrook/types/northbrook';

declare module 'northbrook/types/northbrook' {
  export interface NorthbrookConfig {
    tslint?: {
      patterns?: Array<RegExp | string>;
    };
  }
}
