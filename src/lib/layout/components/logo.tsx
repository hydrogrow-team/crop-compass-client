import { Image } from "@chakra-ui/react"

export function Logo() {
    return (
        <Image
            src={LOGO_SRC}
            borderRadius={8}
            boxSize={50}
        />
    )
}

export const LOGO_SRC = "/assets/crop-compass-logo.webp";