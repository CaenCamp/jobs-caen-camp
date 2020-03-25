<style>

</style>

<script>
    import { fetchOrganization } from '../../stores/organizations';
    export let id;

    const organization = fetchOrganization(id);
</script>

{#if $organization != null}
    <p>{$organization.id} - {$organization.name}</p>
{/if}
