<style>
</style>

<script>
    import { Link } from 'svelte-routing';
    import { organizations } from '../../stores/organizations';
</script>

<ul>
    {#each $organizations as { id, name }, i}
        <li><Link to='/organizations/{id}'>{i} - {name}</Link></li>
    {/each}
</ul>
