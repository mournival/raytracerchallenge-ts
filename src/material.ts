import {Color} from './color';
import {Light} from './light';
import {Tuple} from './tuple';
import {Pattern} from './pattern';
import {Shape} from './shapes';
import {Util} from './util';

export class Material {

    constructor(public readonly color: Color = new Color(1, 1, 1),
                public readonly ambient: number = 0.1,
                public readonly diffuse: number = 0.9,
                public readonly specular: number = 0.9,
                public readonly shininess: number = 200.0,
                public readonly reflective: number = 0.0,
                public readonly transparency: number = 0.0,
                public readonly refractive_index: number = 1.0,
                public readonly pattern: Pattern | null = null) {
    }

    public static equals(lhs: Material, rhs: Material): boolean {
        return Color.equals(lhs.color, rhs.color) &&
            Util.closeTo(lhs.ambient, rhs.ambient) &&
            Util.closeTo(lhs.diffuse, rhs.diffuse) &&
            Util.closeTo(lhs.specular, rhs.specular) &&
            Util.closeTo(lhs.shininess, rhs.shininess) &&
            Util.closeTo(lhs.reflective, rhs.reflective) &&
            Util.closeTo(lhs.transparency, rhs.transparency) &&
            Util.closeTo(lhs.refractive_index, rhs.refractive_index)
            //           Pattern.equals(lhs.pattern, rhs.patter)
            ;
    }

    public replace(field: string, value: Color | Pattern | number): Material {
        switch (field) {
            case 'color':
                return new Material(value as Color, this.ambient, this.diffuse, this.specular, this.shininess, this.reflective, this.transparency, this.refractive_index, this.pattern);
            case 'ambient':
                return new Material(this.color, value as number, this.diffuse, this.specular, this.shininess, this.reflective, this.transparency, this.refractive_index, this.pattern);
            case 'diffuse':
                return new Material(this.color, this.ambient, value as number, this.specular, this.shininess, this.reflective, this.transparency, this.refractive_index, this.pattern);
            case 'specular':
                return new Material(this.color, this.ambient, this.diffuse, value as number, this.shininess, this.reflective, this.transparency, this.refractive_index, this.pattern);
            case 'shininess':
                return new Material(this.color, this.ambient, this.diffuse, this.specular, value as number, this.reflective, this.transparency, this.refractive_index, this.pattern);
            case 'reflective':
                return new Material(this.color, this.ambient, this.diffuse, this.specular, this.shininess, value as number, this.transparency, this.refractive_index, this.pattern);
            case 'transparency':
                return new Material(this.color, this.ambient, this.diffuse, this.specular, this.shininess, this.reflective, value as number, this.refractive_index, this.pattern);
            case 'refractive_index':
                return new Material(this.color, this.ambient, this.diffuse, this.specular, this.shininess, this.reflective, this.transparency, value as number, this.pattern);
            case 'pattern':
                return new Material(this.color, this.ambient, this.diffuse, this.specular, this.shininess, this.reflective, this.transparency, this.refractive_index, value as Pattern);
            default:
                throw 'Unexpected field: ' + field;

        }
    }

    lighting(point: Tuple, eyev: Tuple, normalv: Tuple, light: Light, inShadow: boolean, object?: Shape): Color {
        const color = this.pattern ? this.pattern.pattern_at(point, object) : this.color;
        const effective_color = Color.multiply(color, light.intensity);
        const ambient = effective_color.scale(this.ambient);

        if (inShadow) {
            return ambient;
        }

        const lightv = Tuple.subtract(light.position, point).normalize;
        const light_dot_normal = Tuple.dot(lightv, normalv);
        if (light_dot_normal < 0) {
            return ambient;
        }
        let diffuse: Color = effective_color.scale(this.diffuse * light_dot_normal);

        let specular: Color = Color.BLACK;
        const reflectv = Tuple.reflect(lightv.negative, normalv);
        const reflect_dot_eye = Tuple.dot(reflectv, eyev);
        if (reflect_dot_eye < Util.EPSILON) {
            specular = Color.BLACK;
        } else {
            const factor = Math.pow(reflect_dot_eye, this.shininess);
            specular = light.intensity.scale(this.specular * factor);
        }

        return Color.add(ambient, Color.add(diffuse, specular));
    }
}

