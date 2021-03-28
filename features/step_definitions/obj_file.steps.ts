import {autoBindSteps, loadFeatures} from 'jest-cucumber';
import {objFileSteps} from "./obj_file-steps";
import {lightsSteps, tupleSteps} from "./steps";

const feature = loadFeatures('./features/lights.feature');

autoBindSteps(feature, [tupleSteps, lightsSteps, objFileSteps]);