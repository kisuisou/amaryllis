<script lang="ts">
    import { PUBLIC_API_ORIGIN } from "$env/static/public";

    interface Props {
        isbn?: string;
        title?: string;
        creator?: string;
        volume?: string;
        publisher?: string;
        pubyear?: number;
        is_read?: boolean;
        delFunc: (isbn: string) => void;
    }

    let {
        isbn = "",
        title = "",
        creator = "",
        volume = "",
        publisher = "",
        pubyear = 0,
        is_read = $bindable(false),
        delFunc,
    }: Props = $props();
</script>

<div class="card mb-3 mx-auto">
    <div class="row g-0">
        <div class="col-md-4">
            <img
                src={PUBLIC_API_ORIGIN + `/book_imgs/${isbn}`}
                class="rounded-start"
                style="height: 215px"
                alt="..."
            />
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h4 class="card-title">{title}{volume == "0" ? "" : volume}</h4>
                <p class="card-text">{creator}</p>
                <p class="card-text">{publisher} {pubyear}</p>
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        bind:checked={is_read}
                        id="read-check"
                    />
                    <label class="form-check-label" for="read-check">
                        Read
                    </label>
                </div>
                <button class="btn btn-danger" onclick={() => delFunc(isbn)}
                    >Delete</button
                >
            </div>
        </div>
    </div>
</div>
