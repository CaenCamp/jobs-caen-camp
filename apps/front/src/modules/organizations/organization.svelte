<style>

</style>

<script>
    import { organizationsStore } from '../../stores';
    const { organization, fetchOne } = organizationsStore;
    export let id;
    fetchOne(id);
</script>

{#if $organization != null}
    <p>{$organization.id} - {$organization.name}</p>
{/if}
