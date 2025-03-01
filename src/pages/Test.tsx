import { createSignal } from "solid-js";

import { APIClient } from "~/libs/client";

export default function Test() {
  const client = APIClient;
  const onClick = async () => {
    await client.refresh();
  };

  const getInfo = async () => {
    const { data: info } = await client.me();
    setInfo({ id: info.id, username: info.username });
  };

  const [info, setInfo] = createSignal<{ id?: string; username?: string }>({});
  return (
    <div class="flex w-screen justify-center">
      <div class="flex flex-col gap-2 text-center">
        <button onClick={() => onClick()}>Refresh token</button>
        <button onClick={() => getInfo()}>Get Info</button>
        <p>ID: {info().id}</p>
        <p>Username: {info().username}</p>
      </div>
    </div>
  );
}
