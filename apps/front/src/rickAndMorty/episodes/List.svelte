<script>
    import { getEpisode } from '../api.js';
    
    const fetchEpisodes = (async () => {
        const response = await getEpisode();
        return response.results;
    })()
</script>

<section class="mw7 center">
    {#await fetchEpisodes}
        <p>...waiting</p>
    {:then episodes}
        <header class="tc ph4">
            <h1 class="f3 f2-m f1-l fw2 black-90 mv3">
                Les épisodes
            </h1>
        </header>
        <article class="ba b--black-10 br2 bg-white pa4 mw6 center">
            <ul class="list f6 pl0 mt3 mb0">
                {#each episodes as episode}
                <li class="pv2">
                    <a href="/" class="link blue lh-title">
                        <span class="fw7 underline-hover">Episode {episode.episode} : {episode.name}</span>
                        <span class="db black-60">{episode.air_date}</span>
                    </a>
                </li>
                {/each}
            </ul>
        </article>
    {:catch error}
        <p>An error occurred!</p>
    {/await}
</section>

