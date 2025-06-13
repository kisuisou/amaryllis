<script lang="ts">
    import { page } from "$app/state";
    import { PUBLIC_API_ORIGIN } from "$env/static/public";
    import { onMount, untrack } from "svelte";
    import BookThmbnail from "./book_thmbnail.svelte";
    import { user_id } from "../../stores";
    interface Props {
        data: { user_id: string };
    }

    let { data }: Props = $props();

    let books: { [key: string]: any }[] = $state([]);
    let books_sorted: Map<any, { [key: string]: any }[]> = $state(new Map());
    let sort_order: string = $state("1");
    let is_ready: boolean = $state(false);
    let page_num_now = $state(1);
    let page_num_total = $state(1);
    let is_loading = $state(true);
    const page_standard_val = 10;

    const getUserBooks = async (user_id: string) => {
        const req = await fetch(PUBLIC_API_ORIGIN + `/user_books/${user_id}`, {
            method: "GET",
            mode: "cors",
            credentials: "include",
        });
        books = await req.json();
        is_loading = false;
    };

    $effect(() => {
        selectMode(sort_order);
    });

    $effect(() => {
        const urlSearchParams = page.url.searchParams;
        urlSearchParams.set("page_num", page_num_now.toString());
        history.replaceState(history.state, "", page.url);
    });

    const selectMode = (mode: string) => {
        if (mode == "1") {
            let books_tmp:
                | { [key: string]: any }[]
                | Map<any, { [key: string]: any }[]> = books.sort(
                (a, b) => a.MetaData.PubYear - b.MetaData.PubYear,
            );
            books_tmp = Map.groupBy(
                books_tmp,
                ({ MetaData }) => MetaData.PubYear,
            );
            let page_num = 1;
            let target_years: number[] = [];
            let row_sum = 0;
            let is_detected = false;
            for (let year of books_tmp.keys()) {
                let books_partial = books_tmp.get(year);
                if (books_partial == undefined) continue;
                if (!is_detected) target_years.push(year);
                row_sum += Math.floor(books_partial.length / 12) + 1;
                if (page_standard_val == row_sum) {
                    row_sum = 0;
                    if (page_num_now == page_num) is_detected = true;
                    else if (!is_detected) target_years.splice(0);
                    page_num++;
                }
            }
            page_num_total = page_num;
            for (let year of books_tmp.keys()) {
                if (target_years.includes(year)) continue;
                books_tmp.delete(year);
            }
            const urlSearchParams = page.url.searchParams;
            urlSearchParams.set("sort_order", "1");
            history.replaceState(history.state, "", page.url);
            books_sorted = books_tmp;
        } else if (mode == "2") {
            books = books.sort((a, b) => {
                if (a.MetaData.Title > b.MetaData.Title) return 1;
                else return -1;
            });

            const urlSearchParams = page.url.searchParams;
            urlSearchParams.set("sort_order", "2");
            history.replaceState(history.state, "", page.url);
        } else if (mode == "3") {
            books = books.sort((a, b) => a.CreatedAt - b.CreatedAt);
            const urlSearchParams = page.url.searchParams;
            urlSearchParams.set("sort_order", "3");
            history.replaceState(history.state, "", page.url);
        }
    };

    onMount(() => {
        const urlSearchParams = page.url.searchParams;
        let order = urlSearchParams.get("sort_order");
        let page_num_tmp = urlSearchParams.get("page_num");
        if (order != undefined) {
            sort_order = order;
        }
        if (page_num_tmp != undefined) {
            page_num_now = Number(page_num_tmp);
        }
        getUserBooks(data.user_id);
    });

    const selectPage = (p: number) => {
        page_num_now = p;
    };
</script>

<div class="d-flex align-items-center mb-3">
    <select
        class="form-select me-auto"
        aria-label="Default select example"
        style="width: 150px;"
        bind:value={sort_order}
    >
        <option value="1">出版順</option>
        <option value="2">名前順</option>
        <option value="3">登録順</option>
    </select>
    <a
        class="btn btn-primary my-btn"
        role="button"
        aria-disabled="true"
        href="/book-shelf/add">Add</a
    >
</div>

{#if is_loading}
    <div class="d-flex justify-content-center">
        <div class="spinner-border my-spinner" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
{:else}
    <div class="row">
        {#if sort_order == "1"}
            {#each books_sorted as book}
                <div class="col-12">
                    <h4>{book[0]}</h4>
                </div>
                {#each book[1] as b}
                    <BookThmbnail
                        isbn={b.MetaData.ISBN}
                        title={b.MetaData.Title}
                    />
                {/each}
            {/each}
        {:else}
            {#each books as book}
                <BookThmbnail
                    isbn={book.MetaData.ISBN}
                    title={book.MetaData.Title}
                />
            {/each}
        {/if}
    </div>
{/if}

<div class="d-flex justify-content-center mt-3">
    <nav aria-label="...">
        <ul class="pagination">
            <li class="page-item" class:disabled={page_num_now == 1}>
                <a
                    class="page-link my-link"
                    href={""}
                    onclick={() => selectPage(page_num_now - 1)}>Previous</a
                >
            </li>
            {#each Array(page_num_total) as _, i}
                {#if i + 1 == page_num_now}
                    <li class="page-item" aria-current="page">
                        <a
                            class="page-link"
                            id="my-active"
                            onclick={() => selectPage(i + 1)}
                            href={""}>{i + 1}</a
                        >
                    </li>
                {:else}
                    <li class="page-item">
                        <a
                            class="page-link my-link"
                            onclick={() => selectPage(i + 1)}
                            href={""}>{i + 1}</a
                        >
                    </li>
                {/if}
            {/each}
            <li
                class="page-item"
                class:disabled={page_num_now == page_num_total}
            >
                <a
                    class="page-link my-link"
                    href={""}
                    onclick={() => selectPage(page_num_now + 1)}>Next</a
                >
            </li>
        </ul>
    </nav>
</div>

<style>
    .my-spinner {
        color: #db7093;
    }
    .my-btn {
        background-color: #db7093;
        border-color: #db7093;
    }
    .my-link {
        color: #db7093;
    }
    #my-active {
        background-color: #db7093;
        border-color: #db7093;
        color: #fff;
    }
</style>
