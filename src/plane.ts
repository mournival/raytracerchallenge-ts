import {Matrix} from './matrix';
import {Material} from './material';
import {Tuple, vector} from "./tuple";
import {InterceptableShape} from "./shape";
import {Ray} from "./ray";
import {Intersection} from "./intersection";

export class Plane implements InterceptableShape{

    constructor(
        public readonly transform: Matrix = Matrix.identity(4),
        public readonly material = new Material()
    ) {
    }

    intersect(r: Ray): Intersection[] {
        return [];
    }
}

export function normal_at(p: Plane, pt: Tuple): Tuple {
    return vector(0, 1, 0);
}

