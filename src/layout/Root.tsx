export default function RootLayout(props: any) {
    return (
        <div class="bg-light-bg text-light-bg-text dark:bg-dark-bg dark:text-dark-bg-text">
            {props.children}
        </div>
    );
}
