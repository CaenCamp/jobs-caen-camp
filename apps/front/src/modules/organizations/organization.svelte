<style>

</style>

<script>
    import { organization } from '../../stores';

    export let id;
    organization.fetch(id);
</script>

{#if $organization != null}
    <p>{$organization.id} - {$organization.name}</p>
{/if}
