<script lang="ts">
    import { PUBLIC_API_ORIGIN } from "$env/static/public";
    import { onMount, tick } from "svelte";
    import Bookcard from "./bookcard.svelte";


let isbn = ""
let books: Array<{[key: string]: string | number }> = []

let isbn_input:HTMLInputElement
let promise: Promise<void>

onMount(() => {
    isbn_input.focus()
})

const bookDataFetch = async () => {
    const req =  await fetch(PUBLIC_API_ORIGIN + `/books/${isbn}`, {
        method: "GET", 
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
    })
    books.push(await req.json())
    books = books
}

const registerBook = async (book: {[key: string]: string | number}) => {
    const req = await fetch(PUBLIC_API_ORIGIN + "/user_books", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    })
    return req.status
}

const registerBooks = async () => {
    for(let book of books) {
        let status = await registerBook(book)
        console.log(status)
    }
}

const getBookData = () => {
    promise = bookDataFetch()
    isbn = ""
    setTimeout(() => isbn_input.focus(), 100)
}

const deleteBookData = (isbn: string) => {
    books = books.filter(b => b.ISBN != isbn)
}


</script>

<div class="w-50 mx-auto">
    <form class="mx-auto">
        <h2 class="mt-2">Please Input ISBN</h2>
        <div class="mb-3 input-group">
            <input type="text" class="form-control" id="isbn_input" placeholder="ISBN" bind:value={isbn} bind:this={isbn_input}>
                <button class="btn btn-primary my-btn" type="submit" id="button-addon2" on:click={getBookData} disabled={isbn == ""}>
                    {#await promise}
                        <span class="spinner-border spinner-border-sm my-spinner" role="status" aria-hidden="true"></span>
                    {:then _} 
                        <span style="color: #DB7093;">Submit</span>
                    {/await}
                </button>
        </div>
    </form>

    {#each books as book}
            <Bookcard isbn={String(book.ISBN)} title={String(book.Title)} creator={String(book.Creator)} 
            volume={String(book.Volume)} publisher={String(book.Publisher)} pubyear={Number(book.PubYear)}
            delFunc={deleteBookData}/>
    {/each}

    {#if books.length != 0}
    <button class="btn my-btn" on:click={registerBooks}>
        <span class="my-text">Register</span>
    </button>
    {/if}
</div>


<style>
    .my-btn{
        background-color: #FFFFFF;
        border-color: #DB7093;
        width: 6em;
    }
    .my-spinner{
        color: #DB7093;
    }
    .my-text{
        color: #DB7093;
    }
</style>

