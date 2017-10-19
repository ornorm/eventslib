/** @babel */
import {ANY_EVENT,UNKNOWN_TYPE,EventListener,EventObject} from './event';

export class ActionListener extends EventListener {

    constructor({actionPerformed = null} = {}) {
        super();
        if (actionPerformed !== null) {
            this.actionPerformed = actionPerformed;
        }
    }

    actionPerformed(eo) {

    }
}

export class ActionEvent extends EventObject {

    constructor({source, id = 1001, priority = 0, data = null, when = Date.now()} = {}) {
        super({source, id, priority, data, when});
        if (this.id === ANY_EVENT) {
            this.id = ActionEvent.ACTION_PERFORMED;
        }
    }

    consume() {
        switch (this.id) {
            case ActionEvent.ACTION_PERFORMED:
                this.consumed = true;
                break;
        }
    }

    getActionCommand() {
        return this.getData();
    }

    paramString() {
        let typeStr = '';
        switch (this.id) {
            case ActionEvent.ACTION_PERFORMED:
                typeStr = 'ACTION_PERFORMED';
                break;
            default:
                typeStr = UNKNOWN_TYPE;
        }
        return `
            ${typeStr},
            when=${this.when},
            cmd=${this.data},
            priority=${this.priority},
            posted=${this.posted},
            consumed=${this.consumed}
            `;
    }
}

ActionEvent.ACTION_PERFORMED_FIRST = 1001;
ActionEvent.ACTION_PERFORMED_LAST = 1001;
ActionEvent.ACTION_PERFORMED = ActionEvent.ACTION_PERFORMED_FIRST;