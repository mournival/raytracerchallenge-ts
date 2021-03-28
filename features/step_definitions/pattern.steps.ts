import {autoBindSteps, loadFeatures} from 'jest-cucumber';
import {tupleSteps} from "./steps/tuple-steps";
import {patternSteps} from "./steps/pattern-steps";
import {transformationsSteps} from "./steps/transformations-steps";
import {spheresSteps} from "./steps/spheres-steps";
import {shapesSteps} from "./steps/shapes-steps";
import {matricesSteps} from "./steps/matrices-steps";

const feature = loadFeatures('./features/patterns.feature');

autoBindSteps(feature, [tupleSteps, matricesSteps, transformationsSteps, shapesSteps, spheresSteps, patternSteps]);