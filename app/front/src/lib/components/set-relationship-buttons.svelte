<script lang="ts">
  import { onMount } from "svelte";

  export let user_id: number;
  export let user_relationship: number;
  export let callback: null | ((button: HTMLButtonElement, response: Response) => unknown) = null;
  export let is_inline: boolean = true;

  let add_friend_button: HTMLButtonElement;
  async function add_friend_clickFunc() {
    add_friend_button.disabled = true;
    const response = await fetch(`/api/user/set-relationship/${user_id}/1`, { method: "POST" });
    user_relationship = 1;
    if (callback) {
      callback(add_friend_button, response);
    }
  }

  let remove_friend_button: HTMLButtonElement;
  async function reove_friend_clickFunc() {
    remove_friend_button.disabled = true;
    const response = await fetch(`/api/user/set-relationship/${user_id}/0`, { method: "POST" });
    user_relationship = 0;
    if (callback) {
      callback(remove_friend_button, response);
    }
  }

  let ban_button: HTMLButtonElement;
  async function ban_button_clickFunc() {
    ban_button.disabled = true;
    const response = await fetch(`/api/user/set-relationship/${user_id}/-1`, { method: "POST" });
    user_relationship = -1;
    if (callback) {
      callback(ban_button, response);
    }
  }

  let div: HTMLDivElement;
  onMount(() => {
    div.style.display = is_inline ? "inline" : "block";
  });
</script>

<div bind:this={div}>
  {#if user_relationship <= 0}
    <button
      data-kind="add-friend"
      data-id={user_id}
      data-new-value="1"
      on:click={add_friend_clickFunc}
      bind:this={add_friend_button}>Add Friend</button
    >
  {:else}
    <button
      data-kind="remove-friend"
      data-id={user_id}
      data-new-value="0"
      on:click={reove_friend_clickFunc}
      bind:this={remove_friend_button}>Remove Friend</button
    >
  {/if}
  <button
    data-kind="ban"
    data-id={user_id}
    data-new-value="-1"
    on:click={ban_button_clickFunc}
    bind:this={ban_button}>Ban</button
  >
</div>

<style>
  div {
    & button {
      &:not(:first-child) {
        margin-left: 50px;
      }
      background-color: azure;
    }
  }
</style>
