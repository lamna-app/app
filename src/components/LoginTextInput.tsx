import { AiOutlineEye, AiOutlineEyeInvisible } from "solid-icons/ai";
import { createSignal } from "solid-js";

export default function LoginTextInput({
  type,
  placeholder,
  name,
  required = true,
  ref,
}: {
  type: "text" | "password" | "email";
  placeholder: string;
  name: string;
  required?: boolean;
  ref?: any;
}) {
  const [isHidden, setIsHidden] = createSignal<boolean>(true);

  const getType = () => {
    if (type === "password") {
      return isHidden() ? "password" : "text";
    }
  };

  return (
    <div class="relative w-full">
      <input
        autocomplete="off"
        type={getType()}
        name={name}
        ref={ref}
        placeholder={placeholder}
        required={required}
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
}
