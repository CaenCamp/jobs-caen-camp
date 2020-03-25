<style>

</style>

<script>
    import { Router, Route, Link } from 'svelte-routing';
    import Organizations from './modules/organizations/organizations.svelte';
    import JobPostings from './modules/job-postings/job-postings.svelte';

    export let url = '';
</script>

<Router url="{url}">
    <nav>
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/organizations">Organizations</Link>
    </nav>
    <div>
        <Route path="jobs" component="{JobPostings}" />
        <Route path="organizations" component="{Organizations}" />
        <Route path="/">Home</Route>
    </div>
</Router>
