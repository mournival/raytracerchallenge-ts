import {Matrix} from './matrix';
import {Material} from './material';
import {Interceptable, Intersection} from './intersection';
import {Ray, transform} from './ray';
import {Tuple, vector} from './tuple';

export abstract class Shape implements Interceptable {

    protected constructor(public readonly transform: Matrix,
                          public readonly material: Material,
                          public readonly parent: Shape | null = null) {
    }

    static equals(lhs: Shape, rhs: Shape): boolean {
        return typeof lhs === typeof rhs &&
            Matrix.equals(lhs.transform, rhs.transform) &&
            Material.equals(lhs.material, rhs.material);
    }

    abstract local_intersection(r: Ray): Intersection[];

    abstract local_normal_at(pt: Tuple): Tuple;

    abstract local_replace_transform(t: Matrix): Shape;

    abstract local_replace_material(m: Material): Shape;

    abstract local_replace_parent(s: Shape): Shape;

    normal_at(point: Tuple): Tuple {
        const inverseTransform = this.transform.inverse;
        const local_point = Matrix.multiplyVector(inverseTransform, point);
        const local_normal = this.local_normal_at(local_point);
        let world_normal = Matrix.multiplyVector(inverseTransform.transpose, local_normal);
        world_normal = vector(world_normal.x, world_normal.y, world_normal.z);

        return world_normal.normalize;
    }

    intersect(r: Ray): Intersection[] {
        return this.local_intersection(transform(r, this.transform.inverse));
    }

    replace(prop: Matrix | Material | Shape): Shape {
        if (typeof prop === 'object') {
            if (prop instanceof Matrix) {
                return this.local_replace_transform(prop);
            }
            if (prop instanceof Material) {
                return this.local_replace_material(prop);
            }
            if (prop instanceof Shape) {
                return this.local_replace_parent(prop);
            }
        }
        throw 'Unknown replace for : ' + typeof prop;
    }

    world_to_object(point: Tuple): Tuple {
        let p= point;
        if (this.parent !== null) {
            p = this.parent.world_to_object(point);
        }

        return Matrix.multiplyVector(this.transform.inverse, p);
    }
}

export function isShape(arg: any): arg is Shape {
    return true;
}

