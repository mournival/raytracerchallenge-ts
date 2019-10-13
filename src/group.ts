import {Matrix} from './matrix';
import {Shape} from './shape';
import {Ray} from './ray';
import {Intersection} from './intersection';
import {Tuple, vector} from './tuple';
import {Material} from './material';


export class Group extends Shape {
    constructor(public readonly transform: Matrix = Matrix.identity()) {
        super(transform, new Material());
    }

    get empty(): boolean {
        return true;
    }

    local_intersection(r: Ray): Intersection[] {
        return [];
    }

    local_normal_at(pt: Tuple): Tuple {
        return vector(0, 0, 0);
    }

    local_replace_material(m: Material): Shape {
        return new Group(this.transform);
    }

    local_replace_transform(t: Matrix): Shape {
        return new Group(t);
    }
}
