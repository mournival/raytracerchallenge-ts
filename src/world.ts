import {Sphere} from './sphere';
import {Light} from './light';
import {point, Tuple} from './tuple';
import {Color} from './color';
import {Matrix, scaling} from './matrix';
import {Material} from './material';
import {Ray} from './ray';
import {Intersection} from './intersection';
import {PreComputations, prepare_computations} from './pre-computations';
import {Shape} from './shape';

export function hit(intersections: Intersection[]) {
    if (!intersections || intersections.length === 0)
        return [];
    const xs = intersections.filter(i => i.t >= 0).sort((a, b) => a.t - b.t);
    if (!xs || xs.length === 0)
        return [];
    return [xs[0]];
}

export class World {
    constructor(public readonly lights: Light[] = [], public readonly objects: Shape[] = []) {
    }

    public contains(o: Shape | Light): boolean {
        if (o instanceof Shape) {
            return this.objects.find(os => Shape.equals(os, o)) != undefined;
        }
        if (o instanceof Light) {
            return this.lights.find(os => Light.equals(os, o)) != undefined;
        }
        return false;
    }

    public replace(oldShape: Shape, newShape: Shape): World {
        const map = this.objects.map(o => JSON.stringify(o) === JSON.stringify(oldShape) ? newShape : o);
        return new World(this.lights, map);
    }

    color_at(r: Ray, remaining: number): Color {
        const xs = hit(this.intersect_world(r));
        if (xs.length === 0) {
            return Color.BLACK;
        }
        return this.shade_hit(prepare_computations(xs[0], r), remaining);
    }

    intersect_world(r: Ray): Intersection[] {
        // Require Node Version 11+
        return this.objects.flatMap(o => o.intersect(r)).sort((a, b) => a.t - b.t);

        // for Node Version < 11
        // const xs: Intersection[] = [];
        // this.objects.map(o => o.intersect(r)).forEach(xss => xs.push(...xss));
        // xs.sort((a, b) => a.t - b.t);
        // return xs;
    }

    shade_hit(pc: PreComputations, remaining: number): Color {
        const material = pc.object.material;
        const surface = material.lighting(pc.point, pc.eyev, pc.normalv, this.lights[0], this.is_shadowed(pc.over_point), pc.object);
        let reflected = this.reflected_color(pc, remaining);
        let refracted = this.refracted_color(pc, remaining);
        if (material.reflective > 0 && material.transparency > 0) {
            const reflectance = pc.schlick();
            reflected = reflected.scale(reflectance);
            refracted = refracted.scale((1 - reflectance));
        }
        const intermediate = Color.add(refracted, reflected);
        return Color.add(surface, intermediate);
    }

    is_shadowed(p: Tuple): boolean {
        const v = Tuple.subtract(this.lights[0].position, p);
        const distance = v.magnitude;
        const direction = v.normalize;
        const r = new Ray(p, direction);
        const intersections = hit(this.intersect_world(r));

        return intersections.length > 0 && intersections[0].t < distance;
    }

    reflected_color(comps: PreComputations, remaining: number): Color {
        if (remaining <= 0 || comps.object.material.reflective === 0) {
            return Color.BLACK;
        }
        const reflect_ray = new Ray(comps.over_point, comps.reflectv);
        const color = this.color_at(reflect_ray, remaining - 1);
        return color.scale(comps.object.material.reflective);

    }

    refracted_color(comps: PreComputations, remaining: number): Color {
        if (!comps.object.material.transparency || !remaining || !comps.n1 || !comps.n2) {
            return Color.BLACK;
        }

        const n_ratio = comps.n1 / comps.n2;
        const cos_i = Tuple.dot(comps.eyev, comps.normalv);
        const sin2_t = (n_ratio * n_ratio) * (1 - cos_i * cos_i);

        if (sin2_t > 1) {
            return Color.BLACK;
        }
        const cos_t = Math.sqrt(1.0 - sin2_t);
        const lhs = Tuple.multiply(comps.normalv, n_ratio * cos_i - cos_t);
        const rhs = Tuple.multiply(comps.eyev, n_ratio);
        const direction = Tuple.subtract(
            lhs,
            rhs
        );
        const refract_ray = new Ray(comps.under_point, direction);
        const colorAt = this.color_at(refract_ray, remaining - 1);
        return colorAt.scale(comps.object.material.transparency);
    }
}

export function default_world(): World {
    return new World(
        [
            new Light(point(-10, 10, -10), new Color(1, 1, 1))
        ],
        [
            new Sphere(Matrix.identity(4),
                new Material(new Color(0.8, 1.0, 0.6), 0.1, 0.7, 0.2)),
            new Sphere(scaling(0.5, 0.5, 0.5))
        ]
    );
}

