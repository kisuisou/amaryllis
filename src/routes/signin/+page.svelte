<script lang="ts">
  import { PUBLIC_API_ORIGIN } from "$env/static/public";

  let req = {"user_id": "", "password": ""}
  
  const signin = async () => {
    const signin_result =  await fetch(PUBLIC_API_ORIGIN + "/signin", {
     method: "POST" ,
     mode: "cors",
     credentials: "include",
     headers: {
      "Content-Type": "application/json"
     },
     body: JSON.stringify(req)
    });
    return signin_result.status;
  }

  let promise: Promise<number>
</script>


<form class="mx-auto w-50">
    <h2 class="mt-2">SignIn</h2>
    <div class="mb-3">
      <label for="user_id_input" class="form-label">User ID</label>
      <input type="text" class="form-control" id="user_id_input" bind:value={req.user_id}>
    </div>
    <div class="mb-3">
      <label for="password_input" class="form-label">Password</label>
      <input type="password" class="form-control" id="password_input" bind:value={req.password}>
    </div>
    <button type="submit" class="btn btn-primary my-submit-btn" on:click={() => promise = signin()}>
      {#await promise}
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      {:then _} 
        Submit
      {/await}
    </button>
</form>


<style>
    .my-submit-btn{
        background-color: #DB7093;
        border-color: #DB7093;
        width: 5em;
    }
</style>