import { _aes } from './aes';
import { _aspect } from './aspect';
import { _base64 } from './base64';
import { _cache } from './cache';
import { _chinesePY } from './chinesePY';
import { MouseMoveTracker } from './events/mousemovetracker';
import { WheelHandler } from './events/wheelhandler';
import { CellSizeAndPositionManager, ScalingCellSizeAndPositionManager } from './cellSizeAndPositionManager';
import { Heap } from './heap';
import { LinkedHashMap } from './linkedHashMap';
import { LRU } from './lru';
import { PrefixIntervalTree } from './prefixIntervalTree';
import { Queue } from './queue';
import { Section } from './sectionManager';
import { Tree } from './tree';
import { Vector, Region } from './vector';

export interface _utils extends _aes, _base64, _chinesePY {
  aspect: _aspect
  Cache: _cache
  MouseMoveTracker: typeof MouseMoveTracker
  WheelHandler: typeof WheelHandler
  CellSizeAndPositionManager: typeof CellSizeAndPositionManager
  ScalingCellSizeAndPositionManager: typeof ScalingCellSizeAndPositionManager
  Heap: typeof Heap
  LinkedHashMap: typeof LinkedHashMap
  LRU: typeof LRU
  PrefixIntervalTree: typeof PrefixIntervalTree
  Queue: typeof Queue
  Section: typeof Section
  Tree: typeof Tree
  Vector: typeof Vector
  Region: typeof Region
}
