import {autoBindSteps, loadFeatures} from 'jest-cucumber';
import {tupleSteps} from "./steps/tuple-steps";
import {canvasSteps} from "./steps/canvas-steps";

const feature = loadFeatures('./features/canvas.feature');

autoBindSteps(feature, [tupleSteps, canvasSteps]);