import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { z } from "zod";

import LoginTextInput from "~/components/LoginTextInput";
import { APIClient } from "~/libs/client";
import { setStore, tempSetCookie } from "~/libs/store";

const SignInData = z.object({
  email: z.string().nonempty().email("Invalid email"),
  username: z.string().nonempty("Invalid username").trim(),
  password: z.string().nonempty("Invalid password").min(8).trim(),
});

export default function Signup() {
  const navigate = useNavigate();

  const [formErrors, setFormError] = createSignal<z.typeToFlattenedError<
    z.TypeOf<typeof SignInData>
  > | null>(null);

  const onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget as HTMLFormElement);

    const parsed = SignInData.safeParse({
      email: data.get("email"),
      username: data.get("username"),
      password: data.get("password"),
    });

    if (!parsed.success) {
      return setFormError(parsed.error.flatten());
    }

    const parsedData = parsed.data!;

    const { data: resp, status } = await APIClient.signup(
      parsedData.username,
      parsedData.email,
      parsedData.password,
    );

    if (status === 409) {
      setFormError({ formErrors: ["User already exists"], fieldErrors: {} });
    } else if (status === 200) {
      setStore("auth", { auth: resp.auth_token, refresh: resp.refresh_token });

      setStore("isAuthed", true);
      navigate("/");

      setStore("user", { username: resp.user.username, id: resp.user.id });
      tempSetCookie("lamna-auth", resp.auth_token);
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
              <LoginTextInput type="email" placeholder="Email" name="email" error={formErrors} />

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
                error={formErrors}
              />

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

          {/* TODO: Fix styling for error text */}
          {formErrors()?.["formErrors"]?.[0] && (
            <p class="font-semibold text-red-500">{formErrors()?.["formErrors"]?.[0]}</p>
          )}

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
