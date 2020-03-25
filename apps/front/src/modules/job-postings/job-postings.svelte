<style>
</style>

<script>
    import { jobPostings } from '../../stores/job-postings';
</script>

<ul>
    {#each $jobPostings as { id, title, url }, i}
        <li>{i} - {title} - {url}</li>
    {/each}
</ul>
