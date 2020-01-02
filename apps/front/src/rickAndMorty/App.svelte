<script>
    import { Router, Route } from "svelte-routing";

    import ListeDesEpisodes from './episodes/List.svelte';
    import ListeDesPersonnages from './personnages/List.svelte';
    import ListeDesLieux from './lieux/List.svelte';
    import Footer from './Footer.svelte';
    import Header from './Header.svelte';

    export let url = "";
</script>

<Router url="{url}">
    <Header />
    <Route path="lieux" component={ListeDesLieux} />
    <Route path="personnages" component={ListeDesPersonnages} />
    <Route path="/" component={ListeDesEpisodes} />
</Router>
<Footer />
