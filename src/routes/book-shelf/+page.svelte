<script lang="ts">
    import { PUBLIC_API_ORIGIN } from "$env/static/public";
    export let data: {user_id: string}

    let books: {[key: string]: any}[] = []
    let sort_order: string 

    const getUserBooks = async (user_id: string) => {
        const req = await fetch(PUBLIC_API_ORIGIN + `/user_books/${user_id}`, {
            method: "GET",
            mode: "cors",
            credentials:"include"
        })
        books = await req.json()
    }

    $:{
        let is_ready = books.map((book) => "MetaData" in book).every((x) => x)
        if(is_ready){
            if(sort_order == "1"){
                books = books.sort((a, b) => a.MetaData.PubYear - b.MetaData.PubYear)
            }
            else if(sort_order == "2"){
                books = books.sort((a, b) => {
                    if(a.MetaData.Title > b.MetaData.Title)
                        return 1;
                    else
                        return -1;
                })
            }else if(sort_order == "3"){
                books = books.sort((a, b) => a.CreatedAt - b.CreatedAt)
            }
        }
   }

</script>


<select class="form-select mb-3" aria-label="Default select example" style="width: 150px;" bind:value={sort_order}>
    <option value="1">出版順</option>
    <option value="2">名前順</option>
    <option value="3">登録順</option>
</select>

{#await getUserBooks(data.user_id)}
    <div class="d-flex justify-content-center">
        <div class="spinner-border my-spinner" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
{:then _} 
    <div class="row">
    {#each books as book}
    <div class="col-1">
        <img src={`${PUBLIC_API_ORIGIN}/book_imgs/${book.MetaData.ISBN}`} alt={book.MetaData.Title} style="height: 150px;">
    </div>
    {/each}   
    </div>
{/await}


<style>
    .my-spinner{
        color: #DB7093;
    }

</style>