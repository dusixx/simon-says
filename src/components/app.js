import { header, main } from '../common/elements.js';
import { Game } from './game/game.js';

document.body.append(header.ref, main.ref);

new Game().reset();
