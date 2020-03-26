<style>
    nav {
        background-color: #ccc;
    }
</style>

<script>
    import { Router, Route, Link } from 'svelte-routing';
    import {
        Organizations,
        Organization,
        JobPostings,
        JobPosting,
    } from './routes';

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
        <Route path="/">Hello Test!</Route>
    </div>
</Router>
