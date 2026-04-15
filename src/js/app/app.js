import { header, main } from './refs.js';
import { init as initGame } from './game.js';

document.body.append(header.ref, main.ref);

initGame();
