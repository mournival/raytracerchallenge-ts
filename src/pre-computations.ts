import {position, Ray} from './ray';
import {Intersection} from './intersection';
import {Tuple} from './tuple';
import {Shape} from './shape';
import {Util} from "./util";

export class PreComputations extends Intersection {
    public readonly over_point: Tuple;
    public readonly under_point: Tuple;
    public readonly reflectv: Tuple;

    constructor(public readonly i: Intersection,
                public readonly p: Tuple,
                public readonly eyev: Tuple,
                public readonly normalv: Tuple,
                public readonly inside: boolean,
                public readonly n1: number,
                public readonly n2: number,
    ) {
        super(i.obj, i.t);
        this.over_point = Tuple.add(p, Tuple.multiply(normalv,  Util.EPSILON));
        this.under_point = Tuple.add(p, Tuple.multiply(normalv, -Util.EPSILON));
        this.reflectv = Tuple.reflect(eyev.negative, normalv);
    }

    public get point(): Tuple {
        return this.p;
    }

    public get object(): Shape {
        return this.obj;
    }

    public schlick(): number {
        let cos = Tuple.dot(this.eyev, this.normalv);

        if (this.n1 && this.n2) {
            if (this.n1 > this.n2) {
                const n = this.n1 / this.n2;
                const sin2_t = (n * n) * (1 - cos * cos);
                if (sin2_t > 1.0) {
                    return 1;
                }

                const cos_t = Math.sqrt(1.0 - sin2_t);
                cos = cos_t;
            }
            const r0 = Math.pow((this.n1 - this.n2) / (this.n1 + this.n2), 2);
            return r0 + (1 - r0) * Math.pow(1 - cos, 5);
        }
        return 0.0;
    }

}

export function prepare_computations(i: Intersection, r: Ray, xs: Intersection[]): PreComputations {
    const p = position(r, i.t);
    const normalv = i.obj.normal_at(p);
    const eyev = r.direction.negative;

    let containers: Shape[] = [];
    let n1 = 0;
    let n2 = 0;
    for (let n = 0; n < xs.length; ++n) {
        let x = xs[n];
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
            break;
        }
    }

    if (Tuple.dot(normalv, eyev) < 0) {
        return new PreComputations(i, p, eyev, normalv.negative, true, n1, n2);
    }
    return new PreComputations(i, p, eyev, normalv, false, n1, n2);
}
