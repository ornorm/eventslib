/** @babel */
export const ANY_EVENT = -1;
export const RESERVED_ID_MAX = 9999;
export const UNKNOWN_TYPE = 'unknown type';

export class EventListener {

    constructor() {
    }

}

export class EventListenerProxy extends EventListener {

    constructor(listener) {
        super();
        if (listener === null) {
            throw new ReferenceError("NullPointerException listener class is null");
        }
        this.listener = listener;
    }

    getListener() {
        return this.listener;
    }

}

export class EventObject {

    constructor({source, id = ANY_EVENT, priority = 0, data = null, when = Date.now()} = {}) {
        this.setup({source, id, priority, data, when});
        this.consumed = this.posted = false;
    }

    clone() {
        let E = this.constructor;
        return new E({id: this.id, source: this.source, data: this.data, when: this.when});
    }

    consume() {
        if (this.id >= ANY_EVENT) {
            this.consumed = true;
        }
    }

    dispose() {
        this.consumed = false;
        this.posted = false;
        this.id = ANY_EVENT;
        this.priority = 0;
        this.data = null;
        this.when = 0;
    }

    equals(obj) {
        if (obj !== null) {
            if (obj === this) {
                return true;
            }
            if (!(obj instanceof EventObject)) {
                return false;
            }
            let event = obj;
            return event.getPriority() === this.getPriority() &&
            event.getId() === this.getId() &&
            this.data !== null ? this.data === event.getData() : event.getData() === null &&
                this.posted === event.isPosted() &&
                this.consumed === event.isConsumed() &&
                this.when === event.getWhen();
        }
        return false;
    }

    getData() {
        return this.data;
    }

    getId() {
        return this.id;
    }

    getPriority() {
        return this.priority;
    }

    getSource() {
        return this.source;
    }

    getWhen() {
        return this.when;
    }

    isConsumed() {
        return this.consumed;
    }

    isPosted() {
        return this.posted;
    }

    paramString() {
        let typeStr;
        switch (this.id) {
            case ANY_EVENT:
                typeStr = 'ANY_EVENT';
                break;
            default:
                typeStr = UNKNOWN_TYPE;
        }
        return `${typeStr},
                when=${this.when},
                priority=${this.priority},
                posted=${this.posted},
                consumed=${this.consumed}
                `;
    }

    setIsPosted(posted) {
        this.posted = posted;
    }

    setPriority(priority) {
        this.priority = priority;
    }

    setSource(newSource) {
        if (this.source === newSource) {
            return;
        }
        this.source = newSource;
    }

    setup({source, id = ANY_EVENT, priority = 0, data = null, when = Date.now()} = {}) {
        if (id >= RESERVED_ID_MAX) {
            throw new RangeError("event id >= RESERVED_ID_MAX " + id);
        }
        this.source = source;
        this.id = id;
        this.priority = priority;
        this.data = data;
        this.when = when;
    }

    toString() {
        return `${this.constructor.name}[${this.paramString()}] on ${this.source.constructor.name}`;
    }
}
