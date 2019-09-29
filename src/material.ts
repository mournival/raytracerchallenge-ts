import {Color} from './color';
import {Light} from './light';
import {Tuple} from './tuple';
import {Pattern} from './pattern';
import {Shape} from "./shape";

export class Material {
    public static EPSILON = 0.001;

    constructor(public readonly color: Color = new Color(1, 1, 1),
                public readonly ambient: number = 0.1,
                public readonly diffuse: number = 0.9,
                public readonly specular: number = 0.9,
                public readonly shininess: number = 200.0,
                public readonly reflective: number = 0.0,
                public readonly pattern: Pattern | null = null) {
    }

    public static equals(lhs: Material, rhs: Material): boolean {
        return Color.equals(lhs.color, rhs.color) &&
            Math.abs(lhs.ambient - rhs.ambient) < this.EPSILON &&
            Math.abs(lhs.diffuse - rhs.diffuse) < this.EPSILON &&
            Math.abs(lhs.specular - rhs.specular) < this.EPSILON &&
            Math.abs(lhs.shininess - rhs.shininess) < this.EPSILON;
    }

    public replace(field: string, value: Color | Pattern | number): Material {
        switch (field) {
            case 'pattern':
                return new Material(this.color, this.ambient, this.diffuse, this.specular, this.shininess, this.reflective, value as Pattern);
                break;
            case 'color':
                return new Material(value as Color, this.ambient, this.diffuse, this.specular, this.shininess, this.reflective, this.pattern);
                break;
            case 'ambient':
                return new Material(this.color, value as number, this.diffuse, this.specular, this.shininess, this.reflective, this.pattern);
                break;
            case 'diffuse':
                return new Material(this.color, this.ambient, value as number, this.specular, this.shininess, this.reflective, this.pattern);
                break;
            case 'specular':
                return new Material(this.color, this.ambient, this.diffuse, value as number, this.shininess, this.reflective, this.pattern);
                break;
            case 'shininess':
                return new Material(this.color, this.ambient, this.diffuse, this.specular, value as number, this.reflective, this.pattern);
                break;
            case 'reflective':
                return new Material(this.color, this.ambient, this.diffuse, this.specular, this.shininess, value as number, this.pattern);

            default:
                throw 'Unexpected field: ' + field;

        }
    }

    lighting(point: Tuple, eyev: Tuple, normalv: Tuple, light: Light, inShadow = false, object?: Shape): Color {
        const color = this.pattern ? this.pattern.pattern_at(point, object) : this.color;
        const effective_color = Color.multiply(color, light.intensity);
        const ambient = Color.multiplyScalar(effective_color, this.ambient);

        if (inShadow) {
            return ambient;
        }

        const lightv = Tuple.subtract(light.position, point).normalize;
        const light_dot_normal = Tuple.dot(lightv, normalv);
        if (light_dot_normal < 0) {
            return ambient;
        }
        let diffuse: Color = Color.multiplyScalar(effective_color, this.diffuse * light_dot_normal);

        let specular: Color = Color.BLACK;
        const reflectv = Tuple.reflect(lightv.negative, normalv);
        const reflect_dot_eye = Tuple.dot(reflectv, eyev);
        if (reflect_dot_eye <= 0) {
            specular = Color.BLACK;
        } else {
            const factor = Math.pow(reflect_dot_eye, this.shininess);
            specular = Color.multiplyScalar(light.intensity, this.specular * factor);
        }

        return Color.add(ambient, Color.add(diffuse, specular));
    }
}

