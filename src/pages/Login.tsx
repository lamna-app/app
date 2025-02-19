import { AiOutlineEye, AiOutlineEyeInvisible } from "solid-icons/ai";
import { createSignal, Setter } from "solid-js";

const TextInput = ({
  type,
  placeholder,
  name,
  setter,
}: {
  type: "text" | "password";
  placeholder: string;
  name: string;
  setter: Setter<string>;
}) => {
  const [isHidden, setIsHidden] = createSignal<boolean>(true);

  return (
    <div class="relative w-full">
      <input
        onInput={event => setter(event.target.value)}
        type={type === "text" ? "text" : isHidden() ? "password" : "text"}
        name={name}
        placeholder={placeholder}
        class="ring-gradient group peer w-full rounded-lg bg-white/10 p-3 font-semibold text-white outline-none ring-purple-600 transition focus:ring-2"
      />
      {type === "password" && (
        <button onClick={() => setIsHidden(!isHidden())} type="button">
          {isHidden() ? (
            <AiOutlineEye size={30} class="absolute right-3 top-0 h-full text-white" />
          ) : (
            <AiOutlineEyeInvisible size={30} class="absolute right-3 top-0 h-full text-white" />
          )}
        </button>
      )}
    </div>
  );
};

export default function Login() {
  const [username, setUsername] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget as HTMLFormElement);
    (event.currentTarget as HTMLFormElement).reset();
    setUsername("");
    setPassword("");
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
        <div class="flex h-[430px] w-[350px] flex-col gap-10 rounded-lg bg-light-bg-text px-4 py-8">
          <h1 class="text-center text-3xl font-semibold text-white">
            Welcome to{" "}
            <span class="bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lamna
            </span>
          </h1>
          <div class="flex-1">
            <form class="flex flex-col gap-4 px-2" onSubmit={onSubmit}>
              <TextInput type="text" placeholder="Username" name="username" setter={setUsername} />
              <TextInput
                type="password"
                placeholder="Password"
                name="password"
                setter={setPassword}
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
              Username: {username()}
              <br />
              Password: {password()}
            </form>
          </div>
          <a
            href="#"
            class="text-sm font-light text-pink-600 transition-colors hover:text-purple-600"
          >
            I forgot my password.
          </a>
        </div>
      </div>
    </>
  );
}
