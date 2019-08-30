import {Tuple} from '../../src/tuple';
import {Color} from '../../src/color';
import {Canvas} from '../../src/canvas';
import {Matrix} from '../../src/matrix';
import {Ray} from '../../src/ray';
import {Sphere} from '../../src/sphere';
import {Intersection} from "./intersect";

interface TupleArray {
    [index: string]: Tuple;
}

interface ColorArray {
    [index: string]: Color;
}

interface CanvasArray {
    [index: string]: Canvas;
}

interface MatrixArray {
    [index: string]: Matrix;
}

interface RayArray {
    [index: string]: Ray;
}

interface SphereArray {
    [index: string]: Sphere;
}

interface IntersectionsArray {
    [index: string]: Intersection[];

}

export class Workspace {
    public tuples: TupleArray = {};
    public canvases: CanvasArray = {};
    public colors: ColorArray = {};
    public matrices: MatrixArray = {};
    public rays: RayArray = {};
    public spheres: SphereArray = {};
    public intersections: IntersectionsArray = {};


}