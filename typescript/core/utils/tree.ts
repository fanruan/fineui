export declare class Node {
  id: any;
  set(key: any, value: any): void;
  get(key: any): any;
  isLeaf(): boolean;
  getChildren(): Node[];
  getChildrenLength(): number;
  getFirstChild(): Node;
  getLastChild(): Node;
  setLeft(left: Node): void;
  getLeft(): Node;
  setRight(left: Node): void;
  getRight(): Node;
  setParent(parent: Node): void;
  getParent(): Node;
  getChild(index: number): Node;
  getChildIndex(id: any): number;
  removeChild(id: any): void;
  removeChildByIndex(index: number): void;
  removeAllChilds(): void;
  addChild(child: Node, index: number): void;
  equals(obj: Node): boolean;
  clear(): void;
}


export declare class Tree {
  root: Node;
  addNode(node: Node, newNode: Node, index: number):void;
  isRoot(node: Node): boolean;
  getRoot(): Node;
  clear():void;
  initTree(nodes: any[]):void;
  toJSON<T>(node?: Node): T[];
  toJSONWithNode<T>(node?: Node): T[];
  search(root: Node, target?: any, param?: any): Node;
  traverse(callback: Function): void;
  recursion(callback: Function): void;
  inOrderTraverse(callback: Function): void;
  nrInOrderTraverse(callback: Function): void;
  preOrderTraverse(callback: Function): void;
  nrPreOrderTraverse(callback: Function): void;
  postOrderTraverse(callback: Function): void;
  nrPostOrderTraverse(callback: Function): void;
  static transformToArrayFormat(nodes: Node | Node[], pId: any): Node[];
  static arrayFormat(nodes: Node | Node[], pId: any): Node[];
  static transformToTreeFormat<T>(sNodes: T[]): Node[];
  static treeFormat(sNodes: Node | Node[]): Node[];
  static traversal(array: Node[], callback: Function, pNode: Node): void;
}
