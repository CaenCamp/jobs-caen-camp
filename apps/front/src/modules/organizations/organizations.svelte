<style>

</style>

<script>
    import { Link } from 'svelte-routing';
    import { organizationsStore } from '../../stores';
    const { organizations, fetchList } = organizationsStore;
    fetchList();
</script>

<ul>
    {#each $organizations as { id, name }, i}
        <li>
            <Link to="/organizations/{id}">{i} - {name}</Link>
        </li>
    {/each}
</ul>
