import { EventEmitter2 } from "eventemitter2";

export const events = new EventEmitter2({
    delimiter: '.',
    wildcard: true
});