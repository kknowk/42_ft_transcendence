<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import SetRelationshipButtons from "$lib/components/set-relationship-buttons.svelte";

  export let data: PageData;
  const administrators: number[] = [];
  const normalMembers: number[] = [];

  $: (() => {
    administrators.splice(0, administrators.length);
    normalMembers.splice(0, normalMembers.length);
    if (data.members == null) {
      return;
    }
    for (const [key, kind] of data.members) {
      if (kind === 2) {
        administrators.push(key);
      } else if (kind === 1) {
        normalMembers.push(key);
      }
    }
  })();
</script>

<div class="grid-container">
  {#if data.logs && data.members?.get(data.user.id) === 2}
    <div class="grid-main">
      <slot />
    </div>
    <menu class="grid-menu">
      {#if data.room.kind === 0}
        <a href="/chat/{data.room.id}/invite">Invite</a>
      {/if}
      <a href="/chat/{data.room.id}/kick">Kick</a>
      <a href="/chat/{data.room.id}/mute">Mute</a>
      <a href="/chat/{data.room.id}/ban">Ban</a>
      {#if data.room.owner_id === data.user.id}
        <a href="/chat/{data.room.id}/setting">Setting</a>
      {/if}
      {#if $page.url.pathname !== `/chat/${data.room.id}`}
        <a href="/chat/{data.room.id}">Chat Room</a>
      {/if}
    </menu>
    {#if data.members}
      <details class="member-list">
        <summary>☰</summary>
        <div>
          {#if administrators.length > 0}
            <p>Administrators</p>
            <ul>
              {#each administrators as member_id}
                {#if member_id === data.user.id}
                  <li>
                    <a href="/user/{data.user.id}">{data.user.displayName}</a>
                  </li>
                {:else if (data.users.get(member_id)?.relationship ?? -1) >= 0}
                  <li>
                    <SetRelationshipButtons
                      user_id={member_id}
                      user_relationship={data.users.get(member_id)?.relationship ?? 0}
                    />
                    <a href="/user/{member_id}">{data.users.get(member_id)?.displayName}</a>
                  </li>
                {/if}
              {/each}
            </ul>
          {/if}
          {#if normalMembers.length > 0}
            <p>Members</p>
            <ul>
              {#each normalMembers as member_id}
                {#if member_id === data.user.id}
                  <li>
                    <a href="/user/{data.user.id}">{data.user.displayName}</a>
                  </li>
                {:else if (data.users.get(member_id)?.relationship ?? -1) >= 0}
                  <li>
                    <SetRelationshipButtons
                      user_id={member_id}
                      user_relationship={data.users.get(member_id)?.relationship ?? 0}
                    />
                    <a href="/user/{member_id}">{data.users.get(member_id)?.displayName}</a>
                  </li>
                {/if}
              {/each}
            </ul>
          {/if}
        </div>
      </details>
    {/if}
  {:else}
    <div class="grid-main">
      <slot />
    </div>
  {/if}
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr;
    min-height: max(100%, 100vh);
    padding-left: 0.5em;

    & .grid-main {
      padding-top: 1vh;
      grid-row: 1 / 3;
      grid-column: 1 / 2;
    }

    & .grid-menu {
      grid-row: 1 / 2;
      grid-column: 2 / 3;

      & a {
        display: block;
        width: 100%;
        text-decoration: unset;

        & + a {
          border-top: solid;
        }
      }
    }

    & details.member-list {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
      background-color: cornsilk;

      & summary {
        text-align: right;
        cursor: pointer;
        list-style: none;
        font-size: larger;
        padding: 0.5em;
        padding-top: 0.3em;
      }

      & summary::after {
        content: " Members";
      }

      & ul {
        list-style: none;

        & li {
          & a {
            display: block;
            text-decoration: none;
          }
        }
      }
    }
  }
</style>
