/** @babel */
import {ANY_EVENT,UNKNOWN_TYPE,EventListener,EventListenerProxy,EventObject} from './event';
import {EventListenerAggregate} from './aggregate';

export class PropertyChangeListener extends EventListener {

    constructor({propertyChange = null}) {
        super();
        if (propertyChange !== null) {
            this.propertyChange = propertyChange;
        }
    }

    propertyChange(eo) {

    }

}

export class PropertyChangeListenerProxy extends EventListenerProxy {

    constructor(propertyName, listener) {
        super(listener);
        if (propertyName === null) {
            throw new ReferenceError("NullPointerException propertyName is null");
        }
        this.propertyName = propertyName;
    }

    getPropertyName() {
        return this.propertyName;
    }

    propertyChange(eo) {
        this.getListener().propertyChange(eo);
    }
}

export class PropertyChangeEvent extends EventObject {

    constructor({
                    source,
                    id = 1002,
                    priority = 0,
                    data = null,
                    when = Date.now(),
                    propagationId = 0,
                    propertyName = '',
                    newValue = null,
                    oldValue = null
                } = {}) {
        super({source, id, priority, data, when});
        if (this.id === ANY_EVENT) {
            this.id = PropertyChangeEvent.PROPERTY_CHANGED;
        }
        this.propagationId = propagationId;
        this.propertyName = propertyName;
        this.newValue = newValue;
        this.oldValue = oldValue;
    }

    clone() {
        return new PropertyChangeEvent({
            source: this.source,
            id: this.id,
            priority: this.priority,
            data: this.data,
            when: this.when,
            propagationId: this.propagationId,
            propertyName: this.propertyName,
            newValue: this.newValue,
            oldValue: this.oldValue
        });
    }

    consume() {
        switch (this.id) {
            case PropertyChangeEvent.PROPERTY_CHANGED:
                this.consumed = true;
                break;
        }
    }

    equals(obj) {
        if (obj !== null) {
            if (obj === this) {
                return true;
            }
            if (!(obj instanceof PropertyChangeEvent)) {
                return false;
            }
            let event = obj;
            return super.equals(this, obj) &&
                this.getPropagationId() === event.getPropagationId() &&
                this.getPropertyName() === event.getPropertyName() &&
                this.getOldValue() === event.getOldValue() &&
                this.getNewValue() === event.getNewValue();
        }
        return false;
    }

    getNewValue() {
        return this.newValue;
    }

    getOldValue() {
        return this.oldValue;
    }

    getPropagationId() {
        return this.propagationId;
    }

    getPropertyName() {
        return this.propertyName;
    }

    paramString() {
        let typeStr = '';
        switch (this.id) {
            case PropertyChangeEvent.PROPERTY_CHANGED:
                typeStr = 'PROPERTY_CHANGED';
                break;
            default:
                typeStr = UNKNOWN_TYPE;
        }
        return `
                ${typeStr},
                when=${this.when},
                propagationId=${this.propagationId},
                propertyName=${this.data},
                oldValue=${this.oldValue},
                newValue=${this.newValue},
                priority=${this.priority},
                posted=${this.posted},
                consumed=${this.consumed}
            `;
    }

    setPropagationId(propagationId) {
        this.propagationId = propagationId;
    }
}

PropertyChangeEvent.ACTION_PROPERTY_CHANGED_FIRST = 1002;
PropertyChangeEvent.ACTION_PROPERTY_CHANGED_LAST = 1002;
PropertyChangeEvent.PROPERTY_CHANGED = PropertyChangeEvent.ACTION_PROPERTY_CHANGED_FIRST;

export class IndexedPropertyChangeEvent extends PropertyChangeEvent {

    constructor({
                    source,
                    id = 1003,
                    priority = 0,
                    data = null,
                    when = Date.now(),
                    propagationId = 0,
                    propertyName = '',
                    newValue = null,
                    oldValue = null,
                    index = -1
                } = {}) {
        super({source, id, priority, data, when, propagationId, propertyName, newValue, oldValue});
        if (this.id === ANY_EVENT) {
            this.id = PropertyChangeEvent.INDEX_PROPERTY_CHANGED;
        }
        this.index = index;
    }

    clone() {
        return new IndexedPropertyChangeEvent({
            source: this.source,
            id: this.id,
            priority: this.priority,
            data: this.data,
            when: this.when,
            propagationId: this.propagationId,
            propertyName: this.propertyName,
            newValue: this.newValue,
            oldValue: this.oldValue,
            index: this.index
        });
    }

    equals(obj) {
        if (obj !== null) {
            if (obj === this) {
                return true;
            }
            if (!(obj instanceof IndexedPropertyChangeEvent)) {
                return false;
            }
            return super.equals(obj) &&
                this.getIndex() === obj.getIndex();
        }
        return false;
    }

    getIndex() {
        return this.index;
    }

    paramString() {
        let typeStr = '';
        switch (this.id) {
            case IndexedPropertyChangeEvent.INDEX_PROPERTY_CHANGED:
                typeStr = 'INDEX_PROPERTY_CHANGED';
                break;
            default:
                typeStr = UNKNOWN_TYPE;
        }
        return `
                ${typeStr},
                when=${this.when},
                propagationId=${this.propagationId},
                propertyName=${this.data},
                oldValue=${this.oldValue},
                newValue=${this.newValue},
                index=${this.index},
                priority=${this.priority},
                posted=${this.posted},
                consumed=${this.consumed}
            `;
    }
}

IndexedPropertyChangeEvent.ACTION_INDEX_PROPERTY_CHANGED_FIRST = 1003;
IndexedPropertyChangeEvent.ACTION_INDEX_PROPERTY_CHANGED_LAST = 1003;
IndexedPropertyChangeEvent.INDEX_PROPERTY_CHANGED = IndexedPropertyChangeEvent.ACTION_INDEX_PROPERTY_CHANGED_FIRST;

export class PropertyChangeSupport {

    constructor(target) {
        this.source = target;
    }

    addPropertyChangeListener(change) {
        if (change !== null) {
            let propertyName = null;
            let listener = null;
            if (change instanceof PropertyChangeListenerProxy) {
                let proxy = change;
                propertyName = proxy.getPropertyName();
                listener = proxy.getListener();
                this.addPropertyChangeListener({ propertyName, listener });
            } else if (change instanceof PropertyChangeListener) {
                listener = change;
                if (this.listeners === null) {
                    this.listeners = new EventListenerAggregate(PropertyChangeListener);
                }
                this.listeners.add(listener);
            } else {
                propertyName = change.propertyName;
                listener = change.listener;
                if (this.propertyListeners === null) {
                    this.propertyListeners = {};
                }
                let support = this.propertyListeners[propertyName];
                if (support === null) {
                    support = new PropertyChangeSupport(this.source);
                    this.propertyListeners[propertyName] = support;
                }
                support.addPropertyChangeListener(listener);
            }
        }
    }

    fireIndexedPropertyChange(change) {
        this.firePropertyChange(new IndexedPropertyChangeEvent({
            source: this.source,
            propertyName: change.propertyName,
            oldValue: change.oldValue,
            newValue: change.newValue,
            index: change.index
        }));
    }

    firePropertyChange(change) {
        if (change !== null) {
            let event = null;
            let propertyName = null;
            let newValue = null;
            let oldValue = null;
            let support = null;
            if (change instanceof PropertyChangeEvent) {
                event = change;
                propertyName = event.getPropertyName();
                oldValue = event.getOldValue();
                newValue = event.getNewValue();
                if (oldValue !== null && newValue !== null && oldValue === newValue) {
                    return;
                }
                if (this.listeners !== null) {
                    let list = this.listeners.getListenersInternal();
                    for (const support of list) {
                        support.propertyChange(event);
                    }
                }
                if (this.listeners !== null && propertyName !== null) {
                    support = this.propertyListeners[propertyName];
                    if (support !== null) {
                        support.firePropertyChange(event);
                    }
                }
            } else {
                propertyName = change.propertyName;
                oldValue = change.oldValue;
                newValue = change.newValue;
                if (oldValue !== null && newValue !== null && oldValue === newValue) {
                    return;
                }
                let event = new PropertyChangeEvent({
                    source: this.source,
                    propertyName: propertyName,
                    oldValue: oldValue,
                    newValue: newValue
                });
                this.firePropertyChange(event);
            }
        }
    }

    getPropertyChangeListeners(propertyName) {
        let support = null;
        let returnList = [];
        if (propertyName !== null) {
            if (this.propertyListeners !== null) {
                support = this.propertyListeners[propertyName];
                if (support !== null) {
                    returnList.concat(support.getPropertyChangeListeners(propertyName));
                }
            }
        } else {
            if (this.listeners !== null) {
                returnList.concat(this.listeners.getListenersInternal());
            }
            if (this.propertyListeners !== null) {
                let index = 0;
                let childListeners = null;
                for (let key in this.propertyListeners) {
                    if (this.propertyListeners.hasOwnProperty(key)) {
                        support = this.propertyListeners[key];
                        childListeners = support.getPropertyChangeListeners(propertyName);
                        index = childListeners.length;
                        while (index--) {
                            returnList.push(new PropertyChangeListenerProxy(key, childListeners[index]));
                        }
                    }
                }
            }
        }
        return returnList;
    }

    hasListeners(propertyName) {
        if (propertyName !== null) {
            if (this.listeners !== null && this.listeners[propertyName] !== null) {
                return true;
            }
            if (this.listeners !== null && propertyName !== null) {
                let support = this.propertyListeners[propertyName];
                if (support !== null && support.listeners !== null) {
                    return support.listeners.length > 0;
                }
            }
        }
        return false;
    }

    removePropertyChangeListener(change) {
        if (change !== null) {
            let propertyName = null;
            let listener = null;
            if (change instanceof PropertyChangeListenerProxy) {
                let proxy = change;
                propertyName = proxy.getPropertyName();
                listener = proxy.getListener();
                this.removePropertyChangeListener({ propertyName, listener });
            } else if (change instanceof PropertyChangeListener) {
                listener = change;
                if (this.listeners !== null) {
                    this.listeners.remove(listener);
                }
            } else {
                propertyName = change.propertyName;
                listener = change.listener;
                if (this.propertyListeners !== null) {
                    let support = this.propertyListeners[propertyName];
                    if (support !== null) {
                        support.removePropertyChangeListener(listener);
                    }
                }
            }
        }
    }
}