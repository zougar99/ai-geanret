const { contextBridge, ipcRenderer } = require("electron");

/**
 * طلبات API من العملية الرئيسية لتفادي CORS مع file:// و localhost.
 */
contextBridge.exposeInMainWorld("aiGeanret", {
  replicateFetch: (pathname, init) => ipcRenderer.invoke("replicate-fetch", pathname, init),
  localLlmFetch: (url, init) => ipcRenderer.invoke("local-llm-fetch", url, init),
});
