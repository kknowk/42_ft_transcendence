<script lang="ts">
  import type { PageData } from "./$types";
  import CreateNewChatRoomForm from "$lib/components/create-new-chat-room-form.svelte";
  import type { ChatRoomKind } from "$lib/back/chat-room/chat-room.entity";
  import { goto } from "$app/navigation";

  export let data: PageData;
  let rooms = data.rooms;

  async function createNewChatRoom(
    _: HTMLButtonElement,
    name: string,
    kind: ChatRoomKind,
    password?: string
  ): Promise<boolean> {
    const response = await fetch("/api/chat-room/create", {
      method: "POST",
      body: JSON.stringify({
        name,
        kind,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const room_id = await response.text();
      await goto(`/chat/${room_id}`, { invalidateAll: true });
      return true;
    } else {
      console.error(response);
      return false;
    }
  }
</script>

<svelte:head>
  <title>{data.user.displayName}'s Chats</title>
</svelte:head>

<div class="grid-container">
  <ul class="grid-main">
    {#each rooms as room}
      <li>
        <a href="/chat/{room.id}">{room.name}</a>
      </li>
    {/each}
  </ul>
  <details>
    <summary>Create New Chat Room</summary>
    <CreateNewChatRoomForm callback={createNewChatRoom} />
  </details>
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: 1fr auto;
    height: 100%;
    width: 100%;

    & .grid-main {
      padding-top: 1ex;
      padding-left: 0.5em;
      padding-right: 0.5em;
    }

    & details {
      padding: 0.5em;
      padding-top: 1ex;
      background-color: blanchedalmond;
      min-height: 100%;
      position: sticky;
      top: 0;

      & summary {
        list-style: none;
        font-size: larger;

        &::before {
          content: "☰ ";
          font-size: larger;
        }
      }
    }
  }
</style>
