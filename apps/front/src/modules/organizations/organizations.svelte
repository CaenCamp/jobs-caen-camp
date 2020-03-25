<style>
</style>

<script>
    import { organizations } from '../../stores/organizations';
</script>

<ul>
    {#each $organizations as { id, name }, i}
        <li>{i} - {name}</li>
    {/each}
</ul>
