import {Tuple} from '../../src/tuple';
import {Color} from '../../src/color';
import {Canvas} from '../../src/canvas';
import {Matrix} from "../../src/matrix";

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
export class Workspace {
    public tuples: TupleArray = {};
    public canvases: CanvasArray = {};
    public colors: ColorArray = {};
    public matrices: MatrixArray = {};
}