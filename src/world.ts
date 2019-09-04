import {intersect, Sphere} from "./sphere";
import {Light} from "./light";
import {point} from "./tuple";
import {Color} from "./color";
import {Matrix, scaling} from "./matrix";
import {Material} from "./material";
import {Ray} from "./ray";
import {Intersection} from "../features/step_definitions/intersect";

export class World {
    constructor(public readonly lights: Light[] = [], public readonly objects: Sphere[] = []) {
    }

    public contains(o: Sphere | Light): boolean {
        if (o instanceof Sphere) {
            return this.objects.find(os => Sphere.equals(os, o)) != undefined;
        }
        if (o instanceof Light) {
            return this.lights.find(os => Light.equals(os, o)) != undefined;
        }
        return false;
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

export function intersect_world(w: World, r: Ray): Intersection[] {
    const xss = w.objects.map(o => intersect(o, r));
    const x: Intersection[] = [];
    xss.forEach(xs => x.push(...xs));
    x.sort((a, b) => a.t - b.t);
    return x;
}