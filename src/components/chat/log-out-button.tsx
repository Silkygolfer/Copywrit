import { Button } from "../ui/button";
import { useClerk } from "@clerk/nextjs";

export default function LogOutButton() {
    const { signOut } = useClerk();
    return (
        <Button onClick={() => signOut()}>
            Log Out
        </Button>
    )
}