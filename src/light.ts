import {Tuple} from './tuple';
import {Color} from './color';

export class Light {
    constructor(public readonly position: Tuple, public readonly intensity: Color) {
    }
}