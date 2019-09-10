import {Matrix} from './matrix';

export class Camera {
    constructor(public hsize: number, public  vsize: number, public field_of_view: number, public  transform = Matrix.identity()) {
    }

    public get pixel_size(): number {
        const half_view = Math.tan( this.field_of_view / 2);
        const aspect = this.hsize / this.vsize;
        let half_width = half_view;
        let half_hieght = half_view;
        if (aspect >= 1) {
            half_hieght /= aspect;
        } else {
            half_width *= aspect;
        }
        return  (half_width * 2) / this.hsize;
    }
}