#!/usr/bin/env node --loader ts-node/esm --experimental-specifier-resolution=node
declare const mAIntenance: (componentFilePath: string) => Promise<void>;
export default mAIntenance;
