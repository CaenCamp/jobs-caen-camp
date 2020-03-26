<style>

</style>

<script>
    import { organization } from '../../stores';
    import { onMount } from 'svelte';

    export let id;
    onMount(() => organization.fetch(id));
</script>

{#if $organization != null}
    <p>{$organization.id} - {$organization.name}</p>
{/if}
