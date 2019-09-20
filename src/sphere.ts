import {Ray, transform} from './ray';
import {point, Tuple, vector} from './tuple';
import {Intersection} from './intersection';
import {Matrix} from './matrix';
import {Material} from './material';
import {InterceptableShape, TestShape} from './shape';
import {Plane} from './plane';

export class Sphere implements InterceptableShape {

    constructor(
        public readonly transform: Matrix = Matrix.identity(4),
        public readonly material = new Material()
    ) {
    }

    public static equals(lhs: Sphere, rhs: Sphere): boolean {
        return Matrix.equals(lhs.transform, rhs.transform) && Material.equals(lhs.material, rhs.material);
    }

    public intersect(r: Ray): Intersection[] {
        const r2 = transform(r, this.transform.inverse);
        const sphere_to_ray = Tuple.subtract(r2.origin, point(0, 0, 0));
        const a = Tuple.dot(r2.direction, r2.direction);
        const b = 2 * Tuple.dot(r2.direction, sphere_to_ray);
        const c = Tuple.dot(sphere_to_ray, sphere_to_ray) - 1;
        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            return [];
        }

        const rootDisc = Math.sqrt(discriminant);
        const t1 = (-b - rootDisc) / (2 * a);
        const t2 = (-b + rootDisc) / (2 * a);

        return [new Intersection(this, t1), new Intersection(this, t2)];
    }

}

export function set_transform(s: InterceptableShape, t: Matrix): InterceptableShape {
    if (s instanceof Sphere)
        return new Sphere(t);

    if (s instanceof Plane)
        return new Plane(t);

    if (s instanceof TestShape)
        return new TestShape(t);

    throw 'Unknown class for set_transform: ' + typeof s;
}

export function normal_at(s: InterceptableShape, world_point: Tuple): Tuple {
    const transInv = s.transform.inverse;
    const object_point = Matrix.multiplyVector(transInv, world_point);
    const object_normal = Tuple.subtract(object_point, point(0, 0, 0));
    const world_normal = Matrix.multiplyVector(transInv.transpose, object_normal);
    return vector(world_normal.x, world_normal.y, world_normal.z).normalize;
}
