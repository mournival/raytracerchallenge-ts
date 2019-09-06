import {position, Ray} from './ray';
import {Intersection} from './intersection';
import {Tuple} from './tuple';
import {normal_at} from './sphere';

export class PreComputations extends Intersection {
    constructor(public readonly i: Intersection,
                public readonly p: Tuple,
                public readonly eyev: Tuple,
                public readonly normalv: Tuple
    ) {
        super(i.obj, i.t);
    }

    public get point() {
        return this.p;
    }

}

export function prepare_computations(i: Intersection, r: Ray): PreComputations {
    return new PreComputations(
        i,
        position(r, i.t),
        r.direction.negative,
        normal_at(i.obj, position(r, i.t))
    );
}