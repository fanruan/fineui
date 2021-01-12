import { _function } from "./function";
import { _EventListener } from './eventListener';
import { _DetectElementResize } from './detectElementResize';
import { _load } from './load';
import { _DOM } from './dom';

export interface _web extends _function, _load {
  EventListener: _EventListener,
  ResizeDetector: _DetectElementResize,
  DOM: _DOM
}