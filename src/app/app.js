import { Game } from '../components/game/game.js';
import { header, main } from '../components/ui/index.js';

document.body.append(header.ref, main.ref);

new Game();
