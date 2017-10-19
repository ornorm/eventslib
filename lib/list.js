/** @babel */
const NULL_ARRAY = [];

export class EventListenerList {

    constructor() {
        this.listenerList = NULL_ARRAY;
    }

    add(type, listener) {
        if (listener === null || type === null) {
            return;
        }
        if (!(listener instanceof type)) {
            throw new TypeError("IllegalArgumentException Listener " + listener.constructor.name + " is not of Type" +
                " " + type.name);
        }
        if (this.listenerList.length === NULL_ARRAY.length) {
            this.listenerList = [type, listener];
        } else {
            this.listenerList.push(type, listener);
        }
    }

    getListenerCount({list = null, type = null}) {
        if (list === null && type === null) {
            return this.listenerList.length / 2;
        }
        if (list !== null && type !== null) {
            let count = 0;
            for (const listenerType of list) {
                if (type === listenerType) {
                    count++;
                }
            }
            return count;
        }
        return this.getListenerCount({list: this.listenerList, type: type});
    }

    getListenerList() {
        return this.listenerList;
    }

    getListeners(type) {
        let lList = this.listenerList,
            n = this.getListenerCount({list: lList, type: type}),
            result = new Array(n), j = 0, i;
        for (i = lList.length - 2; i >= 0; i -= 2) {
            if (lList[i] === type) {
                result[j++] = lList[i + 1];
            }
        }
        return result;
    }

    remove(type, listener) {
        if (listener !== null) {
            if (!(listener instanceof type)) {
                throw new TypeError("IllegalArgumentException Listener " + listener.constructor.name + " is not of" +
                    " Type" +
                    " " + type.name);
            }
            let index = -1, i;
            for (i = this.listenerList.length - 2; i >= 0; i -= 2) {
                if ((this.listenerList[i] === type) &&
                    (this.listenerList[i + 1] === listener)) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                this.listenerList.splice(index, 1);
            }
        }
    }

    toString() {
        let lList = this.listenerList, s = "EventListenerList: ", i;
        s += lList.length / 2 + " listeners: ";
        for (i = 0; i <= lList.length - 2; i += 2) {
            s += " Type " + lList[i].name;
            s += " listener " + lList[i + 1].constructor.name;
        }
        return s;
    }
}
