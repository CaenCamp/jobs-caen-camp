<style>

</style>

<script>
    import { jobPostingsStore } from '../../stores';
    const { fetchOne, jobPosting } = jobPostingsStore;
    export let id;
    fetchOne(id);
</script>

{#if $jobPosting != null}
    <p>{$jobPosting.title} - {$jobPosting.url}</p>
{/if}
