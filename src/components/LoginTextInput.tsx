import { AiOutlineEye, AiOutlineEyeInvisible } from "solid-icons/ai";
import { createEffect, createSignal } from "solid-js";
import { z } from "zod";

import type { Accessor, ComponentProps } from "solid-js";

type KeyOfFieldErrors<T extends z.ZodType> = keyof z.typeToFlattenedError<
  z.TypeOf<T>
>["fieldErrors"];

type Props<T extends z.ZodType> = ComponentProps<"input"> & {
  error: Accessor<z.typeToFlattenedError<z.TypeOf<T>> | null>;
};
// this has gotta be some kind of warcrime

export default function LoginTextInput<T extends z.ZodType>({
  error,
  type,
  name,
  ...props
}: Props<T>) {
  const [isHidden, setIsHidden] = createSignal<boolean>(true);
  const [errorMessage, setErrorMessage] = createSignal<string | undefined>(undefined);

  createEffect(() => {
    const msg = error()?.fieldErrors[name as KeyOfFieldErrors<T>]?.[0];
    setErrorMessage(msg);
  });

  const getType = (): string => {
    if (type === "password") {
      return isHidden() ? "password" : "text";
    }

    return "text";
  };

  return (
    <div>
      <div class="relative w-full">
        <input
          autocomplete="off"
          type={getType()}
          class="ring-gradient group peer w-full rounded-lg bg-white/10 p-3 font-semibold text-white outline-none ring-purple-600 transition focus:ring-2"
          name={name}
          {...props}
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

      {errorMessage() && <p class="text-sm font-semibold text-red-500">*{errorMessage()}</p>}
    </div>
  );
}
