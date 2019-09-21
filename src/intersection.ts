import {Ray} from './ray';
import {Shape} from './shape';

export interface Interceptable {
    intersect(r: Ray): Intersection[];
}

export class Intersection {
    constructor(public readonly obj: Shape, public readonly t: number) {
    }
}
