import App from './App.svelte';

const app = new App({
    target: document.body,
    hydrate: false,
});
console.log('ici');
export default app;
