<style>

</style>

<script>
    import { fetchJobPosting } from '../../stores/job-postings';
    export let id;

    const jobPosting = fetchJobPosting(id);
</script>

{#if $jobPosting != null}
    <p>{$jobPosting.title} - {$jobPosting.url}</p>
{/if}
