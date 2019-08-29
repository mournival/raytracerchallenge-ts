import {Tuple} from './tuple';

export class Ray {
    constructor(public readonly origin: Tuple, public readonly  direction: Tuple) {
    }
}

export function position(r: Ray, t: number) {
    return Tuple.add(r.origin, Tuple.multiply(r.direction, t));
}