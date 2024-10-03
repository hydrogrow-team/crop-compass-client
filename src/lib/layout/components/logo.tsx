import { Image } from "@chakra-ui/react"

export function Logo({ isCropped, width = 50 }: { isCropped?: boolean, width?: number }) {
    return (
        <Image
            src={isCropped ? LOGO_CROPPED_SRC : LOGO_SRC}
            borderRadius={8}
            width={width}
        />
    )
}
export const LOGO_CROPPED_SRC = "/assets/logo-cropped.png"
export const LOGO_SRC = "/assets/crop-compass-logo.webp";