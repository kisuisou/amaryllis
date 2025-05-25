<script lang="ts">
    const { children } = $props();
</script>

<div class="footer-fixed">
    <nav class="navbar bg-light navbar-expand-lg">
        <div class="container-fluid">
            <a href="/" class="navbar-brand my-navbar-brand">Amaryllis</a>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                  <li class="nav-item">
                    <a href="/signin" class="nav-link" style="color: #DB7093;">SignIn</a>
                  </li>
               </ul>
            </div>
        </div>
    </nav>

    <div class="container-xl">
        {@render children()}
    </div>

    <div class="container-fluid">
        <footer class="footer bg-light">
           <p class="text-secondary">Powered by <a href="https://kit.svelte.dev/">SvelteKit</a> </p>
        </footer>
    </div>
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
        width: 100%;
        height: 60px;
    }
</style>