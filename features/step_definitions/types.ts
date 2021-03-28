import {Canvas} from "../../src/canvas";
import {Matrix} from "../../src/matrix";
import {Tuple} from "../../src/tuple";
import {Color} from "../../src/color";
import {Ray} from "../../src/ray";
import {Intersection} from "../../src/intersection";
import {Light} from "../../src/light";
import {Material} from "../../src/material";
import {World} from "../../src/world";
import {Camera} from "../../src/camera";
import {Shape} from "../../src/shapes";
import {Pattern} from "../../src/pattern";
import {ObjFile, Parser} from "../../src/obj_file";


type PPM = string[];

export type DataTableType = { [index: string]: string }[];

/* workspace types */
export type CameraArray = { [index: string]: Camera; }
export type CanvasArray = { [index: string]: Canvas; }
export type ColorArray = { [index: string]: Color; }
export type IntersectionArray = { [index: string]: Intersection; }
export type IntersectionArrayArray = { [index: string]: Intersection[]; }
export type LightsArray = { [index: string]: Light; }
export type MaterialsArray = { [index: string]: Material; }
export type MatrixArray = { [index: string]: Matrix; }
export type NumberArray = { [index: string]: number; }
export type ObjFileArray = { [index: string]: ObjFile; }
export type PPMArray = { [index: string]: PPM; }
export type ParserArray = { [index: string]: Parser; }
export type PatternArray = { [index: string]: Pattern; }
export type RayArray = { [index: string]: Ray; }
export type ShapeArray = { [index: string]: Shape; }
export type TupleArray = { [index: string]: Tuple; }
export type WorldArray = { [index: string]: World; }