// tslint:disable-next-line
import { NorthbrookConfig } from 'northbrook/types/northbrook';

declare module 'northbrook/types/northbrook' {
  export interface NorthbrookConfig {
    tsc?: {
      es2015?: boolean;
      directory?: string;
      patterns?: Array<RegExp | string>,
    };
  }
}
