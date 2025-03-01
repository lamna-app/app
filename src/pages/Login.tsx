import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { z } from "zod";

import LoginTextInput from "~/components/LoginTextInput";
import { APIClient } from "~/libs/client";
import { setStore, tempSetCookie } from "~/libs/store";

const LoginData = z.object({
  username: z.string().nonempty("Invalid username").trim(),
  password: z.string().nonempty("Invalid password").trim(),
});

export default function Login() {
  let passwordInput!: HTMLInputElement;
  const navigate = useNavigate();

  const [formErrors, setFormError] = createSignal<z.typeToFlattenedError<
    z.TypeOf<typeof LoginData>
  > | null>(null);

  const onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);

    const parsed = LoginData.safeParse({
      username: data.get("username"),
      password: data.get("password"),
    });

    if (!parsed.success) {
      return setFormError(parsed.error.flatten());
    }

    const { status } = await APIClient.login(parsed.data.username, parsed.data.password);

    if (status === 401) {
      passwordInput.value = "";
      return setFormError({ formErrors: ["Wrong username or password."], fieldErrors: {} });
    } else if (status === 200) {
      navigate("/");
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
        <div class="relative flex h-[430px] w-[350px] flex-col gap-10 rounded-lg bg-light-bg-text px-4 py-8">
          <h1 class="text-center text-3xl font-semibold text-white">
            Welcome to{" "}
            <span class="bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lamna
            </span>
          </h1>

          <div>
            <form class="flex flex-col gap-4 px-2" onSubmit={onSubmit}>
              <LoginTextInput
                type="text"
                placeholder="Username"
                name="username"
                error={formErrors}
              />

              <LoginTextInput
                type="password"
                placeholder="Password"
                name="password"
                ref={passwordInput}
                error={formErrors}
              />

              <div class="flex w-full items-center justify-between">
                <div class="flex gap-2">
                  <input type="checkbox" id="remember" />
                  <label for="remember" class="select-none">
                    Remember me?
                  </label>
                </div>
                <button
                  type="submit"
                  class="w-1/3 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 px-4 py-2 font-semibold text-white outline-none ring-white transition hover:brightness-110 focus:brightness-110"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>

          {formErrors()?.["formErrors"][0] && (
            <p class="text-center font-semibold text-red-500">{formErrors()?.["formErrors"][0]}</p>
          )}

          <div class="absolute bottom-4 flex flex-col gap-1 text-sm font-light">
            <A href="#" class="text-pink-600 transition-colors hover:text-purple-600">
              I forgot my password.
            </A>
            <p class="flex gap-1">
              Don't have an account?
              <A href="/signup" class="text-pink-600 transition-colors hover:text-purple-600">
                Sign up.
              </A>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
