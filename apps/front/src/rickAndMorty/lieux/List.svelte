<script>
    import { getLocation } from '../api.js';
    
    const fetchLieux = (async () => {
        const response = await getLocation();
        return response.results;
    })()
</script>

<section class="mw7 center">
    {#await fetchLieux}
        <p>...waiting</p>
    {:then lieux}
        <header class="tc ph4">
            <h1 class="f3 f2-m f1-l fw2 black-90 mv3">
                Les lieux
            </h1>
        </header>
        <article class="ba b--black-10 br2 bg-white pa4 mw6 center">
            <ul class="list f6 pl0 mt3 mb0">
                {#each lieux as lieu}
                <li class="pv2">
                    <a href="/" class="link blue lh-title">
                        <span class="fw7 underline-hover">{lieu.name}</span>
                        <span class="db black-60">type: {lieu.type} / dimension: {lieu.dimension}</span>
                    </a>
                </li>
                {/each}
            </ul>
        </article>
    {:catch error}
        <p>An error occurred!</p>
    {/await}
</section>

