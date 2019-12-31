<script>
    export let name;
    import Company from './Company.svelte';
    let companyName = 'CaenCamp';
    const changeCompanyName = () => {
        const newName = companyName === 'CaenCamp' ? 'Coding CaenCamp' : 'CaenCamp';
        companyName = newName;
    };
</script>

<style>
    h1 {
        color: purple;
    }
</style>

<h1>Hello {name}!</h1>
<Company name={companyName} />
<button on:click={changeCompanyName}>Changer le nom de la boite</button>
