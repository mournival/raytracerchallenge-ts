import {Matrix} from './matrix';
import {point, Tuple} from './tuple';
import {Ray} from './ray';
import {Canvas} from './canvas';
import {World} from './world';
import {Color} from './color';

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

    ray_for_pixel(px: number, py: number): Ray {
        const xOffset = (px + 0.5) * this.pixel_size;
        const yOffset = (py + 0.5) * this.pixel_size;

        const world_x = this.half_width - xOffset;
        const world_y = this.half_height - yOffset;

        const pixel = Matrix.multiplyVector(this.transform.inverse, point(world_x, world_y, -1));
        const origin = Matrix.multiplyVector(this.transform.inverse, point(0, 0, 0));
        const direction = Tuple.subtract(pixel, origin).normalize;
        return new Ray(origin, direction);
    }

    render(world: World): Canvas {
        const image = new Canvas(this.hsize, this.vsize);
        for (let y = 0; y < this.vsize; ++y) {
            for (let x = 0; x < this.hsize; ++x) {
                const ray = this.ray_for_pixel(x, y);
                const color = world.color_at(ray, 5);

                Canvas.write_pixel(image, y, x, color);

                // let acc = Color.BLACK;
                // const n = 3;
                // for (let u = 0; u < n; ++u) {
                //     for (let v = 0; v < n; ++v) {
                //         const ray = this.ray_for_pixel(x + (1 / n * u) - 2 / n, y + (1 / n * v) - 2 / n);
                //         acc = Color.add(acc, world.color_at(ray, 5));
                //     }
                // }
                // Canvas.write_pixel(image, y, x, acc.scale(1 / Math.pow(n, 2)));

                // if (!Color.equals(color, acc.scale(1/9))) {
                //     console.log(JSON.stringify('x : ' + x + ', y: ' + y));
                //     console.log(JSON.stringify(ray));
                //     console.log(JSON.stringify(color));
                //     console.log(JSON.stringify(acc));
                //     console.log('');
                // }
            }
        }

        return image;
    }
}
