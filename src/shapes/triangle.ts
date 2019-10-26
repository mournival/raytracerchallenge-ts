import {Matrix} from '../matrix';
import {Material} from '../material';
import {Tuple, vector} from '../tuple';
import {Shape} from './shape';
import {Ray} from '../ray';
import {Intersection} from '../intersection';
import {Util} from '../util';

export class Triangle extends Shape {

    public e1: Tuple = vector(0, 0, 0);
    public e2: Tuple = vector(0, 0, 0);

    public normal: Tuple;

    constructor(
        public p1: Tuple,
        public p2: Tuple,
        public p3: Tuple,
        public readonly transform: Matrix = Matrix.identity(4),
        public readonly material = new Material(),
        public readonly parent: Shape | null = null
    ) {
        super(transform, material, parent);
        this.e1 = Tuple.subtract(p2, p1);
        this.e2 = Tuple.subtract(p3, p1);
        this.normal = Tuple.cross(this.e2, this.e1).normalize;
    }

    local_intersection(r: Ray): Intersection[] {
        const dir_cross_e2 = Tuple.cross(r.direction, this.e2);
        const det = Tuple.dot(this.e1, dir_cross_e2);

        if (Util.closeTo(det, 0)) {
            return [];
        }

        const f = 1 / det;

        const p1_to_origin = Tuple.subtract(r.origin, this.p1);
        const u = f * Tuple.dot(p1_to_origin, dir_cross_e2);
        if (u < 0 || u > 1) {
            return [];
        }

        const origin_cross_e1 = Tuple.cross(p1_to_origin, this.e1);
        const v = f * Tuple.dot(r.direction, origin_cross_e1);
        if (v < 0 || u + v > 1) {
            return [];
        }

        const t = f * Tuple.dot(this.e2, origin_cross_e1);

        return [new Intersection(this, t)];
    }

    local_normal_at(pt: Tuple, hit: Intersection): Tuple {
        return this.normal;
    }

    local_replace_transform(t: Matrix): Shape {
        return new Triangle(this.p1, this.p2, this.p3, t, this.material, this.parent);
    }

    local_replace_material(m: Material): Shape {
        return new Triangle(this.p1, this.p2, this.p3, this.transform, m, this.parent);
    }

    local_replace_parent(s: Shape): Shape {
        return new Triangle(this.p1, this.p2, this.p3, this.transform, this.material, s);
    }

    equals(rhs: Shape): boolean {
        return rhs instanceof Triangle
            && Matrix.equals(this.transform, rhs.transform)
            && Material.equals(this.material, rhs.material)
            && Tuple.equals(this.e1, rhs.e1)
            && Tuple.equals(this.e2, rhs.e2)
            && Tuple.equals(this.normal, rhs.normal)
            && Tuple.equals(this.p1, rhs.p1)
            && Tuple.equals(this.p2, rhs.p2)
            && Tuple.equals(this.p3, rhs.p3)
            // && this.parent.equals(rhs.parent)
            ;
    }

}

