import {Tuple} from './tuple';
import {Color} from './color';

export class World {
    constructor(public readonly lights = [], public readonly objects = []) {
    }
}