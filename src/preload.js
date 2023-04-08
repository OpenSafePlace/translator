const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        invoke: (channel, data) => {
            let valid = ["text-translate"];

            if (valid.includes(channel))
                return ipcRenderer.invoke(channel, data);
        }
    }
);
