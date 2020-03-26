<style>

</style>

<script>
    import { OrganizationStore } from '../../store';
    import { onMount } from 'svelte';

    export let id;
    onMount(() => OrganizationStore.init(id));
</script>

{#if $OrganizationStore != null}
    <p>{$OrganizationStore.id} - {$OrganizationStore.name}</p>
{/if}
