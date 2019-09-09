import {Matrix} from './matrix';

export class Camera {
    constructor(public hsize: number, public  vsize: number, public field_of_view: number, public  transform = Matrix.identity()) {
    }
}