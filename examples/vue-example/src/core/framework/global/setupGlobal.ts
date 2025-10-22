import type { App } from 'vue';  
// setup core
export async function setupGlobal(app: App) { 

  app.config.globalProperties.$headers = () => { 
    const headers = {}; 
    return headers;
  };
}
