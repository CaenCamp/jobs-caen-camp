<script>
    import { getCharacter } from '../api.js';
    
    const fetchPersonnages = (async () => {
        const response = await getCharacter();
        console.log(response.results[0]);
        return response.results;
    })()
</script>

<section class="mw7 center">
    {#await fetchPersonnages}
        <p>...waiting</p>
    {:then personnages}
        <header class="tc ph4">
            <h1 class="f3 f2-m f1-l fw2 black-90 mv3">
                Les personnages
            </h1>
        </header>
        <article class="ba b--black-10 br2 bg-white pa4 mw6 center">
            <ul class="list pl0 mt0 measure center">
                {#each personnages as personnage}
                <li class="flex items-center lh-copy pa3 ph0-l bb b--black-10">
                    <img class="w2 h2 w3-ns h3-ns br-100" src={personnage.image} alt={personnage.name} />
                    <div class="pl3 flex-auto">
                        <span class="f6 db black-70">{personnage.name}</span>
                        <span class="f6 db black-70">{personnage.gender} / {personnage.status}</span>
                    </div>
                    <div>
                        <a href="tel:" class="f6 link blue hover-dark-gray">{personnage.species}</a>
                    </div>
                </li>
                {/each}
            </ul>
        </article>
    {:catch error}
        <p>An error occurred!</p>
    {/await}
</section>
