<style>
    h3 {
        color: blue;
    }
</style>

<script>
    import {jobs} from '../stores';
</script>
<ul>
{#each $jobs as { id, title }, i}
    <li>{i} - {title}</li>
{/each}
</ul>
