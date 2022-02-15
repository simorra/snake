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

  peekFirst() {
    if(this.isEmpty())
      return null;
    return this.elems[this.first];
  }

  peekLast() {
    if(this.isEmpty())
      return null;
    let last = (next-1 >= 0) ? next-1 : this.elems.length-1;
    return this.elems[last];
  }
}