<script lang="ts">
import { PUBLIC_API_ORIGIN } from "$env/static/public";
import { onMount, tick } from "svelte";
import Bookcard from "./bookcard.svelte";
import { SvelteToast, toast } from '@zerodevx/svelte-toast'


let isbn = ""
let books: Array<{[key: string]: any}> = []

let isbn_input:HTMLInputElement
let fetch_promise: Promise<void>
let register_promise: Promise<void>

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
    let data = await req.json()
    books.push(data)
    books = books
}

const registerBook = async (book: {[key: string]: any}) => {
    const req = await fetch(PUBLIC_API_ORIGIN + "/user_books", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({isbn: book.ISBN, is_read: book.is_read})
    })
    return req.status
}

const registerBooks = async () => {
    let i = 0;
    for(let book of books) {
        let status = await registerBook(book)
        if(status == 409){
            let msg = `${book.Title}${book.Volume == 0 ? "" : book.Volume}は既に登録された書籍です`
            toast.push(msg, {
            theme: {
                 '--toastBarBackground': "#DB7093",
                 '--toastWidth': `${msg.length}rem`
            }})
        }
        if(status == 201){
            i++;
        }
        books = books.filter(b => b != book)
    }
    if(i != 0){
        let msg = `${i}件の書籍が登録されました`
        toast.push(msg, {
        theme: {
                '--toastBarBackground': "#DB7093",
                '--toastWidth': `${msg.length}rem`
        }})
    }
}

const register = () => {
    register_promise = registerBooks()
}

const getBookData = () => {
    fetch_promise = bookDataFetch()
    isbn = ""
    setTimeout(() => isbn_input.focus(), 100)
}

const deleteBookData = (isbn: string) => {
    books = books.filter(b => b.ISBN != isbn)
}

</script>


<SvelteToast />

<div class="w-50 mx-auto">
    <form class="mx-auto">
        <h2 class="mt-2">Please Input ISBN</h2>
        <div class="mb-3 input-group">
            <input type="text" class="form-control" id="isbn_input" placeholder="ISBN" bind:value={isbn} bind:this={isbn_input}>
                <button class="btn btn-primary my-btn" type="submit" id="button-addon2" on:click={getBookData} disabled={isbn == ""}>
                    {#await fetch_promise}
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
            bind:is_read={book.is_read} delFunc={deleteBookData}/>
    {/each}

    {#if books.length != 0}
        <button class="btn my-btn" on:click={register}>
            {#await register_promise}
                <span class="spinner-border spinner-border-sm my-spinner" role="status" aria-hidden="true"></span>
            {:then _} 
                <span class="my-text">Register</span>
            {/await}
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

