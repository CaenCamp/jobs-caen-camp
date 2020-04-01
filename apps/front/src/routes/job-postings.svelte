<style>

</style>

<script>
    import { Link } from 'svelte-routing';
    import { JobPostingsStore } from '../store';
    import { JobPostingCard } from '../components';
    import { onMount } from 'svelte';

    onMount(() => JobPostingsStore.init());
</script>

<div class="flex flex-col items-center p-5 bg-gray-100">
    {#each $JobPostingsStore as jobPosting}
        <JobPostingCard {jobPosting} />
    {/each}
</div>
