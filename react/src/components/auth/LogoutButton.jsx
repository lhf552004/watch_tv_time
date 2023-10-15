import { Button } from "@chakra-ui/react"
import { useAuth } from "reactfire"


const LogoutButton = () => {
    const auth = useAuth()
    return (
        <Button
        size="sm"
        rounded="md"
        // color={["primary", "primary", "brand.light", "brand.light"]}
        color="white"
        bg={["brand_light", "brand_light", "brand.strong", "brand.strong"]}
        _hover={{
        bg: [
            "brand.100",
            "brand.100",
            "brand.600",
            "brand.600",
        ],
        }}    
        onClick={() => auth.signOut() } >Sign Out</Button>
    )
}

export default LogoutButton