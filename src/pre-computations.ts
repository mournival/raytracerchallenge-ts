import {position, Ray} from './ray';
import {Intersection} from './intersection';
import {point, Tuple, vector} from './tuple';
import {normal_at} from "./sphere";

export class PreComputations extends Intersection {
    constructor(public readonly i: Intersection,
                public readonly p: Tuple = point(0, 0, 0),
                public readonly eyev = vector(0, 0, 0),
                public readonly normalv = vector(0, 0, 0)
    ) {
        super(i.obj, i.t);
    }

    public get point() {
        return this.p;
    }

}

export function prepare_computations(i: Intersection, r: Ray): PreComputations {
    const p = position(r, i.t);
    const e = r.direction.negative;
    const n = normal_at(i.obj, p);
    return new PreComputations(i, p, e, n);
}