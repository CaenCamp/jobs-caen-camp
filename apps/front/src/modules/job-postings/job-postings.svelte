<style>
</style>

<script>
    import { Link } from 'svelte-routing';
    import { jobPostings } from '../../stores/job-postings';
</script>

<ul>
    {#each $jobPostings as { id, title, url }, i}
        <li><Link to='/jobs/{id}'>{i} - {title} - {url}</Link></li>
    {/each}
</ul>
