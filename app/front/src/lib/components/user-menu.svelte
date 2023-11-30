<script lang="ts">
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";

  let intervalId: number | null = null;
  let noticeCount: number = 0;

  async function periodicFunc() {
    const response = await fetch("/api/user/get-notice-count");
    if (response.ok) {
      const result = await response.json();
      if (typeof result === "number") {
        noticeCount = result;
      }
    }
  }

  onMount(() => {
    intervalId = setInterval(periodicFunc, 300000) as any as number;
  });

  onDestroy(() => {
    if (browser && typeof intervalId === "number") {
      clearInterval(intervalId);
    }
  });
</script>

<details>
  <summary>☰</summary>
  <nav>
    <menu>
      <ul>
        <li>
          <a href="/home">Home</a>
        </li>
        <li>
          <a href="/home/setting">Personal Setting</a>
        </li>
        <li>
          <a href="/home/friend">My Friends</a>
        </li>
        <li>
          <a href="/home/direct-message/list">Direct Messages</a>
        </li>
        <li>
          <a href="/home/chat/list">Chats</a>
        </li>
        <li>
          <a href="/home/notice" class="notice" data-count={noticeCount}>Notice</a>
        </li>
        <li>
          <form method="post" action="/auth/logout">
            <input type="submit" value="Logout" />
          </form>
        </li>
      </ul>
    </menu>
  </nav>
</details>

<style>
  form {
    display: inline;
  }

  input {
    background: none;
    color: blue;
    border: none;
    padding: 0;
    margin: 0;
    text-decoration: underline;
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
  }

  .notice[data-count="0"]::after {
    display: none;
  }

  .notice::after {
    content: " (" attr(data-count) ")";
    color: deeppink;
  }

  ul {
    list-style: none;

    & li {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
      padding-right: 1em;
    }
  }

  details {
    & summary {
      cursor: pointer;
      list-style: none;
      font-size: x-large;
    }

    padding: 0.5em;
    background-color: honeydew;
    min-height: 100vh;
  }

  menu {
    margin-block-start: unset;
    margin-block-end: unset;
    margin-inline-start: unset;
    margin-inline-end: unset;
    padding-inline-start: unset;
  }

  ul {
    margin-block-start: unset;
    margin-block-end: unset;
    margin-inline-start: unset;
    margin-inline-end: unset;
    padding-inline-start: unset;
  }

  a {
    text-decoration: none;
  }
</style>
