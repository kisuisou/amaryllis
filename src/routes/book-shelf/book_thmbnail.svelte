<script lang="ts">
    import { PUBLIC_API_ORIGIN } from "$env/static/public";
    export let isbn = ""
    export let title = ""
</script>


<div class="col-1">
    <img src={`${PUBLIC_API_ORIGIN}/book_imgs/${isbn}`} alt={title} style="height: 150px;">
</div>