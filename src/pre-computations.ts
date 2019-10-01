import {position, Ray} from './ray';
import {Intersection} from './intersection';
import {Tuple} from './tuple';
import {Shape} from './shape';

export class PreComputations extends Intersection {
    public readonly over_point: Tuple;
    public readonly under_point: Tuple;
    public readonly reflectv: Tuple;

    constructor(public readonly i: Intersection,
                public readonly p: Tuple,
                public readonly eyev: Tuple,
                public readonly normalv: Tuple,
                public readonly inside: boolean,
                public readonly n1?: number,
                public readonly n2?: number,
    ) {
        super(i.obj, i.t);
        this.over_point = Tuple.add(p, Tuple.multiply(normalv, Tuple.EPSILON));
        this.under_point = Tuple.subtract(p, Tuple.multiply(normalv, Tuple.EPSILON));
        this.reflectv = Tuple.reflect(eyev.negative, normalv);
    }

    public get point(): Tuple {
        return this.p;
    }

    public get object(): Shape {
        return this.obj;
    }

}

export function prepare_computations(i: Intersection, r: Ray, xs?: Intersection[]): PreComputations {
    const p = position(r, i.t);
    const normalv = i.obj.normal_at(p);
    const eyev = r.direction.negative;

    let containers: Shape[] = [];
    let n1 = 0;
    let n2 = 0;
    if (xs) {
        for (let x of xs) {
            if (Shape.equals(i.obj, x.obj) && i.t === x.t) {
                if (containers.length === 0) {
                    n1 = 1.0;
                } else {
                    n1 = containers[containers.length - 1].material.refractive_index;
                }
            }

            const index = containers.indexOf(x.obj, 0);
            if (index > -1) {
                containers.splice(index, 1);
            } else {
                containers = [...containers, x.obj];
            }

            if (Shape.equals(i.obj, x.obj) && i.t === x.t) {
                if (containers.length === 0) {
                    n2 = 1.0;
                } else {
                    n2 = containers[containers.length - 1].material.refractive_index;
                }
            }
        }
    }

    if (Tuple.dot(normalv, eyev) < 0) {
        return new PreComputations(i, p, eyev, normalv.negative, true, n1, n2);
    }
    return new PreComputations(i, p, eyev, normalv, false, n1, n2);
}
