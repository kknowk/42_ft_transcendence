<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { PageData } from "./$types";
  import { browser } from "$app/environment";
  import { showTimeDiff } from "$lib/time-helper";

  export let data: PageData;

  let now = Math.floor(Date.now() / 1000);
  let intervalId: number | null = null;
  function calcDate(seconds: number) {
    const date = new Date(seconds * 1000);
    return date.toString();
  }

  onMount(() => {
    intervalId = setInterval(() => {
      now = Math.floor(Date.now() / 1000);
    }, 600000) as any as number;
  });

  onDestroy(() => {
    if (browser && intervalId !== null) {
      clearInterval(intervalId);
    }
  });
</script>

<main>
  <ul>
    {#each data.notices as notice}
      <li id="notice-{notice.id.toString()}">
        <article>
          {@html notice.content}
          <time title={calcDate(notice.date)}>{showTimeDiff(notice.date, now)}</time>
        </article>
      </li>
    {/each}
  </ul>
</main>
