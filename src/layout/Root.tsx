export default function RootLayout(props: any) {
  return (
    <div class="dark box-border flex h-dvh w-dvw flex-col gap-4 bg-light-bg p-4 text-light-bg-text dark:bg-dark-bg dark:text-dark-bg-text">
      {props.children}
    </div>
  );
}
