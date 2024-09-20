import { useUserContext } from "@/contexts/UserContext"


export default function Home(){
    const {user} = useUserContext();
    return(
        <>
            <h1>Welcome {user?.first_name + ' ' + user?.last_name}</h1>
        </>
    )
}