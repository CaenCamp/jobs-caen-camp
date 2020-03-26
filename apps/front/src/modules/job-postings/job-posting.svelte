<style>

</style>

<script>
    import { jobPosting } from '../../stores';

    export let id;
    jobPosting.fetch(id);
</script>

{#if $jobPosting != null}
    <p>{$jobPosting.title} - {$jobPosting.url}</p>
{/if}
