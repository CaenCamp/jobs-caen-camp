<style>

</style>

<script>
    import { jobPosting } from '../../stores';
    import { onMount } from 'svelte';

    export let id;
    onMount(() => jobPosting.fetch(id));
</script>

{#if $jobPosting != null}
    <p>{$jobPosting.title} - {$jobPosting.url}</p>
{/if}
