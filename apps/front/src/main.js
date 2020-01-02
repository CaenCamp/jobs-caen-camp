// import App from './components/App.svelte';
import App from './rickAndMorty/App.svelte';

const app = new App({
    target: document.body,
    hydrate: false,
});

export default app;
