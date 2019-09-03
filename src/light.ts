import {Tuple} from './tuple';
import {Color} from './color';

export class Light {
    constructor(public readonly position: Tuple, public readonly intensity: Color) {
    }

    public static equals(lhs: Light, rhs: Light): boolean {
        return Tuple.equals(lhs.position, rhs.position)
            && Color.equals(lhs.intensity, rhs.intensity);
    }
}