declare module "@observablehq/plot" {
  export function plot(options?: {}): any;
  export function ruleX(data: any[], config: any): any;
  export function marks(...marks: any[]): any[];
  export class Mark {
    constructor(data: any, channels: any[], options: {}, defaults: any);
    data: any;
    sort: any;
    initializer: any;
    transform: any;
    facet: any;
    channels: any[];
    dx: number;
    dy: number;
    clip: any;
    initialize(
      facets: any,
      facetChannels: any
    ): {
      data: any;
      facets: any;
      channels: any;
    };
    filter(index: any, channels: any, values: any): any;
    plot({ marks, ...options }?: { marks?: any[] }): any;
  }
}
