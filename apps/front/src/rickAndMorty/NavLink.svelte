<script>
  import { Link } from "svelte-routing";
  export let to = "";
  const getProps = ({ location, href, isPartiallyCurrent, isCurrent }) => {
    const isActive = href === '/' ? isCurrent : isPartiallyCurrent || isCurrent;
    // The object returned here is spread on the anchor element's attributes
    if (isActive) {
      return { class: "link dim red dib mr3" };
    }
    return { class: 'link dim white dib mr3' };
  }
</script>

<Link to="{to}" getProps="{getProps}">
  <slot />
</Link>
