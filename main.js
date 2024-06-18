import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import fluidSim from './fluidSim.js'
import {initCubes} from "./marchingCubes.js";

document.querySelector('#app').innerHTML = `
  <div id="fluidSim">
  </div>
`;

// fluidSim(document.querySelector('#fluidSim'));
initCubes(document.querySelector('#fluidSim'));
