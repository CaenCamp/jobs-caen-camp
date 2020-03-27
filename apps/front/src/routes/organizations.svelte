<style>

</style>

<script>
    import { Link } from 'svelte-routing';
    import { OrganizationsStore } from '../store';
    import { onMount } from 'svelte';

    onMount(() => OrganizationsStore.init());
</script>

<ul>
    {#each $OrganizationsStore as { id, name }, i}
        <li>
            <Link to="/organizations/{id}">{i} - {name}</Link>
        </li>
    {/each}
</ul>
