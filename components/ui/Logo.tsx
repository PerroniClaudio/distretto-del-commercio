"use client";

import Image from "next/image";

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
}

function Logo({ className = "", width = 120, height = 68, priority = false }: LogoProps) {
    return (
        <Image
            src="/distretto.svg"
            alt="Distretto Logo"
            width={width}
            height={height}
            className={className}
            priority={priority}
        />
    );
}

export default Logo;