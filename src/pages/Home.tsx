import ChatLog from "../components/ChatLog";

export default function Home() {
    const messages = [
        {
            id: 1,
            author: "123",
            content:
                "asdfasdhfajkfhsjkdfhsdjkhfdsjkfhsdajkfhsdjkfhdsjkfhsdajkfhdsajkfhdsjkfhdsjkfhsdakjfhsjfkhdsajfshjfkshadfdjskfhdjsakfhsdjkafhsdjkadhfjksahfsdjkafhsdajkfhdsajkfhasjkfdshajkhasdjfhajskdfhsadjkfhsajdkfhsjkfhajfkhsfjkhfjksfhskdjfhsdhfjksashdfkfhsakfjkfjsdkfjskfjdskalfjsdklfjdsklfjadsklfjdskfjasdkfjasfjkasdjfklsadjfkafjaksldfjslkafjdklfjsklfjsaklfjdsklfjskljfklsjskfsdljasdkfjksadfjkasldfjkjfaksldjfaksdhfasldhfjaskdhfkjhfjaskfhdsjakfjkahfjkasdhfjkafhasjkdfhajksdhfjaksdfhjaksdhfjkdsafhk",
        },
        {
            id: 2,
            author: "123",
            content: Math.random().toString(),
        },
        {
            id: 3,
            author: "123",
            content: Math.random().toString(),
        },
        {
            id: 4,
            author: "123",
            content: Math.random().toString(),
        },
        {
            id: 5,
            author: "123",
            content: Math.random().toString(),
        },
        {
            id: 6,
            author: "123",
            content: Math.random().toString(),
        },
    ] satisfies Message[];
    return (
        <div class="flex h-screen w-screen items-center justify-center">
            <ChatLog messages={messages.splice(0, 3)} />
        </div>
    );
}
