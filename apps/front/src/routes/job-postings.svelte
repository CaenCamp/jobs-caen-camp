<style>

</style>

<script>
    import { Link } from 'svelte-routing';
    import { JobPostingsStore } from '../store';
    import { onMount } from 'svelte';

    onMount(() => JobPostingsStore.init());
</script>

<ul>
    {#each $JobPostingsStore as { id, title, url }, i}
        <li>
            <Link to="/jobs/{id}">{i} - {title} - {url}</Link>
        </li>
    {/each}
</ul>
