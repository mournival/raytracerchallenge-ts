import {Color} from './color';

export class Material {
    constructor(public readonly color = new Color(1, 1, 1),
                public readonly  ambient = 0.1,
                public readonly  diffuse = 0.9,
                public readonly  specular = 0.9,
                public readonly  shininess = 200.0) {
    }

    public static EPSILON = 0.001;

    public static equals(lhs: Material, rhs: Material): boolean {
        return Color.equals(lhs.color, rhs.color) &&
            Math.abs(lhs.ambient - rhs.ambient) < this.EPSILON &&
            Math.abs(lhs.diffuse - rhs.diffuse) < this.EPSILON &&
            Math.abs(lhs.specular - rhs.specular) < this.EPSILON &&
            Math.abs(lhs.shininess - rhs.shininess) < this.EPSILON;
    }
}