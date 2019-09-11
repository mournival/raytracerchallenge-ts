import {Matrix} from './matrix';
import {point, Tuple} from './tuple';
import {Ray} from './ray';
import {Canvas} from './canvas';
import {color_at, World} from './world';

export class Camera {

    public readonly pixel_size: number;
    public half_width: number;
    public half_height: number;

    constructor(public hsize: number, public  vsize: number, public field_of_view: number, public  transform = Matrix.identity()) {
        const half_view = Math.tan(this.field_of_view / 2);
        const aspect = this.hsize / this.vsize;
        this.half_width = half_view;
        this.half_height = half_view;
        if (aspect >= 1) {
            this.half_height = this.half_height / aspect;
        } else {
            this.half_width = this.half_width * aspect;
        }
        this.pixel_size = (this.half_width * 2) / this.hsize;
    }
}

export function ray_for_pixel(c: Camera, px: number, py: number): Ray {
    const xOffset = (px + 0.5) * c.pixel_size;
    const yOffset = (py + 0.5) * c.pixel_size;

    const world_x = c.half_width - xOffset;
    const world_y = c.half_height - yOffset;

    const pixel = Matrix.multiplyVector(c.transform.inverse, point(world_x, world_y, -1));
    const origin = Matrix.multiplyVector(c.transform.inverse, point(0, 0, 0));
    const direction = Tuple.subtract(pixel, origin).normalize;
    return new Ray(origin, direction);

}

export function render(camera: Camera, world: World): Canvas {
    const image = new Canvas(camera.hsize, camera.vsize);
    for (let y = 0; y < camera.vsize; ++y) {
        for (let x = 0; x < camera.hsize; ++x) {
            const ray = ray_for_pixel(camera, x, y);
            const color = color_at(world, ray);
            Canvas.write_pixel(image, x, y, color);
        }
    }

    return image;
}