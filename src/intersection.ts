import {Ray} from './ray';
import {InterceptableShape} from './shape';

export interface Interceptable {
    intersect(r: Ray): Intersection[];
}

export class Intersection {
    constructor(public readonly obj: InterceptableShape, public readonly t: number) {
    }
}
