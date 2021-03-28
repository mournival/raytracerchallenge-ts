import {autoBindSteps, loadFeatures} from 'jest-cucumber';
import {tupleSteps} from "./steps/tuple-steps";
import {lightsSteps} from "./steps/lights-steps";
import {materialsSteps} from "./steps/materials-steps";

const feature = loadFeatures('./features/materials.feature');

autoBindSteps(feature, [tupleSteps, lightsSteps, materialsSteps]);