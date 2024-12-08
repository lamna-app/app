export default function RootLayout(props: any) {
  return (
    <div class="dark box-border bg-light-bg p-4 text-light-bg-text dark:bg-dark-bg dark:text-dark-bg-text">
      {props.children}
    </div>
  );
}
