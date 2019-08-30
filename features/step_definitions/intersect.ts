import {Sphere} from '../../src/sphere';

export type Interceptable = Sphere;

export class Intersection {
    constructor(public readonly obj: Interceptable, public readonly value: number) {

    }
}