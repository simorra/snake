export class CircularQueue {
  constructor(maxSize) {
    this.elems = new Array(maxSize).fill(null);
    this.first = 0;
    this.next = 0;
  }

  isEmpty() {
    return this.elems[this.first] === null;
  }

  isFull() {
    return this.elems[this.next] !== null;
  }

  enqueue(el) {
    if(this.isFull())
      return false;
    
    this.elems[next++] = el;
    this.next %= this.elems.length;
    return true;
  }

  dequeue() {
    if(this.isEmpty())
      return null;

    let el = this.elems[this.first];
    this.elems[this.first++] = null;
    this.first %= this.elems.length;    
    return el;
  }

  peek() {
    return this.elems[this.first];
  }
}