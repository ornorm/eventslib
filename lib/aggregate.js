/** @babel */
import {EventListener} from './event';

const isAssignableFrom = (superclass, subclass) => {
    return subclass.prototype instanceof superclass ||
        subclass === superclass;
};

export class EventListenerAggregate {

    constructor(listenerClass) {
        if (listenerClass === null) {
            throw new ReferenceError("NullPointerException listener class is null");
        }
        if (isAssignableFrom(EventListener, listenerClass)) {
            throw new TypeError("ClassCastException listener class " + listenerClass + " is not assignable to EventListener");
        }
        this.listenerClass = listenerClass;
        this.listenerList = [];
    }

    add(listener) {
        if (listener === null) {
            throw new ReferenceError("NullPointerException listener is null");
        }
        let listenerClass = this.getListenerClass();
        if (!(listener instanceof listenerClass)) {
            throw new TypeError("ClassCastException listener " + listener.constructor.name + " is not " + "an" +
                " instance of" +
                " listener class " + listenerClass.name);
        }
        this.listenerList.push(listener);
    }

    getListenerClass() {
        return this.listenerClass;
    }

    getListenersCopy() {
        return this.listenerList.splice(0, this.listenerList.length);
    }

    getListenersInternal() {
        return this.listenerList;
    }

    isEmpty() {
        return this.listenerList.length === 0;
    }

    remove(listener) {
        if (listener === null) {
            throw new ReferenceError("NullPointerException listener is null");
        }
        let listenerClass = this.getListenerClass(), index;
        if (!(listener instanceof listenerClass)) {
            throw new TypeError("ClassCastException listener " + listener.constructor.name + " is not " + "an" +
                " instance of" +
                " listener class " + listenerClass.name);
        }
        index = this.listenerList.indexOf(listener);
        this.listenerList.splice(index, 1);
    }

    size() {
        return this.listenerList.length;
    }

    toString() {
        let srcName = this.constructor.name;
        let clsName = this.listenerClass.name;
        return `${srcName}[listenerClass=${clsName}, listenerList=[${this.listenerList.join(',')}]]`;
    }
}
