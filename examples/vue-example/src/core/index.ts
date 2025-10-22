import type { App } from 'vue';
import { setupUtils } from './framework/utils/setupUtils';
import { setupGlobal } from './framework/global/setupGlobal';  
// setup core
export async function setupCore(app: App) {
  setupGlobal(app);
  setupUtils(app);  
}
