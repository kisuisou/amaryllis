<script lang="ts">
    const { children } = $props();
</script>

<div class="footer-fixed">
    <nav class="navbar bg-light">
        <div class="container-fluid">
            <a href="#" class="navbar-brand my-navbar-brand">Amaryllis</a>
        </div>
    </nav>

    <div class="container">
        {@render children()}
    </div>

    <footer class="footer bg-light">
        <div class="container-fluid">
           <span class="text-secondary">Powered by <a href="https://kit.svelte.dev/">SvelteKit</a> </span>
        </div>
    </footer>
</div>

<style>
    .my-navbar-brand{
        color: #DB7093;
        font-size: 1.6rem;
    }
    .footer-fixed {
        min-height: 100vh;
        position: relative;
        padding-bottom: 150px;
        box-sizing: border-box;
    }

    footer {
        position: absolute;
        bottom: 0;
    }
</style>
