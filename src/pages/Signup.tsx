import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";

import LoginTextInput from "~/components/LoginTextInput";
import { setStore, tempSetCookie } from "~/libs/store";

export default function Signup() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);

    const payload = {
      username: data.get("username"),
      password: data.get("password"),
      email: data.get("email"),
    };
    const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/v1/signup`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (resp.status === 409) {
      setErrorMessage("This username or email is already taken.");
    } else if (resp.status === 200) {
      const json = await resp.json();
      setStore("auth", { auth: json.auth_token, refresh: json.refresh_token });

      setStore("isAuthed", true);
      navigate("/");

      setStore("user", { username: json.username, id: json.id });
      tempSetCookie(json.auth_token);
    }
  };

  return (
    <>
      <div class="absolute left-0 top-0 z-10 h-screen w-screen overflow-hidden">
        <div
          style={{ mask: "url(/app/splash.svg)" }}
          class="h-full w-full scale-125 bg-gradient-to-br from-purple-600 to-pink-600 opacity-40"
        ></div>
      </div>
      <div class="absolute left-0 top-0 z-20 flex h-screen w-screen items-center justify-center">
        <div class="relative flex h-[450px] w-[350px] flex-col gap-8 rounded-lg bg-light-bg-text px-4 py-8">
          <h1 class="text-center text-3xl font-semibold text-white">Create an account</h1>
          <div>
            <form class="flex flex-col gap-4 px-2" onSubmit={onSubmit}>
              <LoginTextInput type="email" placeholder="Email" name="email" />
              <LoginTextInput type="text" placeholder="Username" name="username" />
              <LoginTextInput type="password" placeholder="Password" name="password" />
              <div class="w-full">
                <button
                  type="submit"
                  class="float-right w-1/3 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 px-4 py-2 font-semibold text-white outline-none ring-white transition hover:brightness-110 focus:brightness-110"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
          {/* TODO: Fix styling for error text*/}
          {errorMessage() && <p class="text-center font-semibold text-red-500">{errorMessage()}</p>}
          <div class="absolute bottom-4 flex flex-col gap-1 text-sm font-light">
            <p class="flex gap-1">
              Already have an acount?
              <A href="/login" class="text-pink-600 transition-colors hover:text-purple-600">
                Log in.
              </A>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
