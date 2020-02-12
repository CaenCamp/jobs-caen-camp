<style>
    h1 {
        color: purple;
    }
</style>

<script>
    import Company from './Company.svelte';
    import Jobs from './Jobs.svelte';
    import {name as nameStore} from '../stores';

    const changeCompanyName = () =>
        nameStore.update(name =>
            name === 'CaenCamp' ? 'Coding CaenCamp' : 'CaenCamp'
        );
</script>

<h1>Hello {$nameStore}!</h1>
<Jobs/>
<Company name="{$nameStore}" />
<button on:click="{changeCompanyName}">Changer le nom de la boite</button>
