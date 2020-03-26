<style>

</style>

<script>
    import { JobPostingStore } from '../../store';
    import { onMount } from 'svelte';

    export let id;
    onMount(() => JobPostingStore.init(id));
</script>

{#if $JobPostingStore != null}
    <p>{$JobPostingStore.title} - {$JobPostingStore.url}</p>
{/if}
