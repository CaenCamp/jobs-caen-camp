import App from "./app.svelte";

const app = new App({
    target: document.body,
    hydrate: false,
});
export default app;
