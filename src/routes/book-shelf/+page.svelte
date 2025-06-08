<script lang="ts">
    import { page } from "$app/stores";
    import { PUBLIC_API_ORIGIN } from "$env/static/public";
    import { onMount } from "svelte";
    import BookThmbnail from "./book_thmbnail.svelte";
    export let data: {user_id: string}

    let books: {[key: string]: any}[] = []
    let books_sorted: {[key: string]: any}[] | Map<any, { [key: string]: any; }[]> = []
    let sort_order: string 
    let is_ready: boolean
    let page_num_now = 1
    let page_num_total = 1
    const page_standard_val = 10

    const getUserBooks = async (user_id: string) => {
        const req = await fetch(PUBLIC_API_ORIGIN + `/user_books/${user_id}`, {
            method: "GET",
            mode: "cors",
            credentials:"include"
        })
        books = await req.json()
    }

    const urlSearchParams = $page.url.searchParams

    $:{
        is_ready = books.map((book) => "MetaData" in book).every((x) => x)
        if(is_ready){
            if(sort_order == "1"){
                books_sorted = books.sort((a, b) => a.MetaData.PubYear - b.MetaData.PubYear)
                books_sorted = Map.groupBy(books_sorted, ({MetaData}) => MetaData.PubYear)
                let page_num = 1
                let target_years: number[] = []
                let row_sum = 0
                let is_detected = false
                for(let year of books_sorted.keys()){
                    let books_partial = books_sorted.get(year)
                    if (books_partial == undefined)
                        continue
                    if (!is_detected)
                        target_years.push(year)
                    row_sum += Math.floor(books_partial.length / 12) + 1
                    if(page_standard_val == row_sum){
                        row_sum = 0
                        if(page_num_now == page_num)
                            is_detected = true
                        else if (!is_detected)
                            target_years.splice(0)
                        page_num++
                    }
                }
                page_num_total = page_num
                for(let year of books_sorted.keys()){
                    if(target_years.includes(year))
                        continue
                    books_sorted.delete(year)
                }
                urlSearchParams.set("sort_order", "1")
                urlSearchParams.set("page_num", page_num_now.toString())
                history.replaceState(history.state, '', $page.url)
            }
            else if(sort_order == "2"){
                books = books.sort((a, b) => {
                    if(a.MetaData.Title > b.MetaData.Title)
                        return 1;
                    else
                        return -1;
                })
                urlSearchParams.set("sort_order", "2")
                history.replaceState(history.state, '', $page.url)
            }else if(sort_order == "3"){
                books = books.sort((a, b) => a.CreatedAt - b.CreatedAt)
                urlSearchParams.set("sort_order", "3")
                history.replaceState(history.state, '', $page.url)
            }
        }
   }

   onMount(() => {
    let order = urlSearchParams.get("sort_order")
    let page_num_tmp = urlSearchParams.get("page_num")
    if(order != undefined){
        sort_order = order
    }
    if(page_num_tmp != undefined){
        page_num_now = Number(page_num_tmp)
    }
   })

   const selectPage = (p: number) => {
        urlSearchParams.set("page_num", p.toString())
        history.replaceState(history.state, '', $page.url)
        page_num_now = p
   }

</script>


<div class="d-flex align-items-center mb-3">
    <select class="form-select me-auto" aria-label="Default select example" style="width: 150px;" bind:value={sort_order}>
        <option value="1">出版順</option>
        <option value="2">名前順</option>
        <option value="3">登録順</option>
    </select>
    <a class="btn btn-primary my-btn" role="button" aria-disabled="true" href="/book-shelf/add">Add</a>
</div>

{#await getUserBooks(data.user_id)}
    <div class="d-flex justify-content-center">
        <div class="spinner-border my-spinner" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
{:then _} 
    <div class="row">
        {#if sort_order == "1" && is_ready}
            {#each books_sorted as book}
            <div class="col-12">
                <h4>{book[0]}</h4>
            </div>
                {#each book[1] as b}
                    <BookThmbnail isbn={b.MetaData.ISBN} title={b.MetaData.Title} />
                {/each}
            {/each}
        {:else}
        {#each books as book}
            <BookThmbnail isbn={book.MetaData.ISBN} title={book.MetaData.Title} />
        {/each}   
        {/if}
        </div>
{/await}


<div class="d-flex justify-content-center mt-3">
<nav aria-label="...">
  <ul class="pagination">
    <li class="page-item" class:disabled={page_num_now == 1}>
      <a class="page-link my-link" href={""} on:click={() => selectPage(page_num_now - 1)}>Previous</a>
    </li>
    {#each Array(page_num_total) as _, i}
        {#if (i + 1) == page_num_now}
            <li class="page-item" aria-current="page">
                <a class="page-link" id="my-active" on:click={() => selectPage(i + 1)} href={""}>{i + 1}</a>
            </li>
        {:else}
            <li class="page-item"><a class="page-link my-link" on:click={() => selectPage(i + 1)} href={""}>{i + 1}</a></li>
        {/if}
    {/each}
    <li class="page-item" class:disabled={page_num_now == page_num_total}>
      <a class="page-link my-link" href={""} on:click={() => selectPage(page_num_now + 1)}>Next</a>
    </li>
  </ul>
</nav>
</div>


<style>
    .my-spinner{
        color: #DB7093;
    }
    .my-btn{
        background-color: #DB7093;
        border-color: #DB7093;
    }
    .my-link{
        color: #DB7093;
    }
    #my-active{
        background-color: #DB7093;
        border-color: #DB7093;
        color: #fff;
    }
</style>
