<script lang="ts">
    import { PUBLIC_API_ORIGIN } from "$env/static/public";

    export let isbn = ""
    export let title = ""
    export let creator = ""
    export let volume = ""
    export let publisher = ""
    export let pubyear = 0;
    export let delFunc: (isbn: string) => void
</script>
<div class="card mb-3 mx-auto">
    <div class="row g-0">
        <div class="col-md-4">
            <img src={PUBLIC_API_ORIGIN + `/book_imgs/${isbn}`} class="rounded-start" style="height: 215px" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h4 class="card-title">{title}{volume == "0" ? "" : volume}</h4>
                <p class="card-text">{creator}</p>
                <p class="card-text">{publisher} {pubyear}</p>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="read-check">
                    <label class="form-check-label" for="read-check">
                       Read 
                    </label>
                </div>
                <button class="btn btn-danger" on:click={() => delFunc(isbn)}>Delete</button>
            </div>
        </div>
    </div>
</div>