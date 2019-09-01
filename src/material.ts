import {Color} from './color';

export class Material {
    constructor(public readonly color = new Color(1, 1, 1),
                public readonly  ambient = 0.1,
                public readonly  diffuse = 0.9,
                public readonly  specular = 0.9,
                public readonly  shininess = 200.0) {
    }

}