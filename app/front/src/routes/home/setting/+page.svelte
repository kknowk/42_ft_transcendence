<script lang="ts">
  import { invalidate, invalidateAll } from "$app/navigation";
  import type { PageData } from "./$types";
  export let data: PageData;

  async function submitFunction(ev: SubmitEvent) {
    ev.preventDefault();
    console.log("SUBMIT");
    const formData = new FormData(ev.target as HTMLFormElement);
    {
      const userName = formData.get("user-name")?.valueOf();
      if (
        userName == null ||
        typeof userName !== "string" ||
        userName.length === 0 ||
        userName === data.user.displayName
      ) {
        formData.delete("user-name");
      }
    }
    {
      const userEmail = formData.get("user-email")?.valueOf();
      if (
        userEmail == null ||
        typeof userEmail !== "string" ||
        userEmail.length === 0 ||
        userEmail === data.email
      ) {
        formData.delete("user-email");
      }
    }
    {
      const user2fa = formData.get("user-2fa")?.valueOf();
      if ((user2fa === "on") === data.user.two_factor_authentication_required) {
        formData.delete("user-2fa");
      } else if (user2fa !== "on") {
        formData.set("user-2fa", "off");
      }
    }
    await fetch("/api/user/change-settings", {
      method: "POST",
      body: formData,
    });
    await invalidateAll();
  }
</script>

<form on:submit={submitFunction}>
  <input type="reset" value="Reset" />
  <input type="submit" value="Change" />
  <div>
    <label>
      Name:
      <input type="text" name="user-name" value={data.user.displayName} />
    </label>
  </div>
  <div>
    <label>
      Email:
      <input type="email" name="user-email" value={data.email ?? ""} />
    </label>
  </div>
  <div class="toggle-switch">
    <label for="2fa">2 Factor Auth:</label>
    <label class="toggle-switch">
      <input
        id="2fa"
        type="checkbox"
        name="user-2fa"
        checked={data.user.two_factor_authentication_required}
      />
    </label>
  </div>
</form>

<style>
  div {
    margin-top: 0.5em;
    margin-bottom: 0.5em;

    &.toggle-switch {
      display: flex;
      align-items: center;
    }
  }

  label.toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;

    &::before {
      content: "";
      position: absolute;
      cursor: pointer;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: gainsboro;
      transition: 0.4s;
      border-radius: 34px;
    }

    &::after {
      content: "";
      position: absolute;
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }

    &:has(input:checked) {
      &::before {
        background-color: greenyellow;
      }

      &::after {
        transform: translateX(26px);
      }
    }

    & input {
      display: none;
    }
  }
</style>
