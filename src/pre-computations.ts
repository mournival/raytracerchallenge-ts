import {position, Ray} from './ray';
import {Intersection} from './intersection';
import {Tuple} from './tuple';
import {normal_at, Sphere} from './sphere';

export class PreComputations extends Intersection {
    constructor(public readonly i: Intersection,
                public readonly p: Tuple,
                public readonly eyev: Tuple,
                public readonly normalv: Tuple,
                public readonly inside: boolean
    ) {
        super(i.obj, i.t);
    }

    public get point(): Tuple {
        return this.p;
    }

    public get object(): Sphere {
        return this.obj;
    }

}

export function prepare_computations(i: Intersection, r: Ray): PreComputations {
    const p = position(r, i.t);
    const normalv = normal_at(i.obj, p);
    const eyev = r.direction.negative;
    if (Tuple.dot(normalv, eyev) < 0) {
        return new PreComputations(i, p, eyev, normalv.negative, true);
    }
    return new PreComputations(i, p, eyev, normalv, false);
}