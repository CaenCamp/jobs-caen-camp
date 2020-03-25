<style>

</style>

<script>
    import { Router, Route, Link } from 'svelte-routing';
    import Organizations from './modules/organizations/organizations.svelte';
    import Organization from './modules/organizations/organization.svelte';
    import JobPostings from './modules/job-postings/job-postings.svelte';
    import JobPosting from './modules/job-postings/job-posting.svelte';

    export let url = '';
</script>

<Router {url}>
    <nav>
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/organizations">Organizations</Link>
    </nav>
    <div>
        <Route path="jobs" component="{JobPostings}" />
        <Route path="jobs/:id" let:params>
            <JobPosting id="{params.id}" />
        </Route>
        <Route path="organizations" component="{Organizations}" />
        <Route path="organizations/:id" let:params>
            <Organization id="{params.id}" />
        </Route>
        <Route path="/">Home</Route>
    </div>
</Router>
