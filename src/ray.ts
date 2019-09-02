import {Tuple} from './tuple';
import {Matrix} from './matrix';

export class Ray {
    constructor(public readonly origin: Tuple, public readonly  direction: Tuple) {
    }
}

export function position(r: Ray, t: number) {
    return Tuple.add(r.origin, Tuple.multiply(r.direction, t));
}

export function transform(r: Ray, m: Matrix): Ray {
    return new Ray(Matrix.multiplyVector(m , r.origin), Matrix.multiplyVector(m , r.direction));
}