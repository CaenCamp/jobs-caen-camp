<style>

</style>

<script>
    import { Link } from 'svelte-routing';
    import { jobPostingsStore } from '../../stores';
    const { fetchList, jobPostings } = jobPostingsStore;
    fetchList();
</script>

<ul>
    {#each $jobPostings as { id, title, url }, i}
        <li>
            <Link to="/jobs/{id}">{i} - {title} - {url}</Link>
        </li>
    {/each}
</ul>
