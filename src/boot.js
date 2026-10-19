// Starts the page. In the iPhone app the saved altars are put back first (see native.js).
import { restoreSaved } from './native.js';

restoreSaved().finally(() => import('./main.js'));
