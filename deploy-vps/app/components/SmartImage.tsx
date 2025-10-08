"use client";
import Image from "next/image";

type SmartImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export default function SmartImage({ src, alt, width, height, className, priority }: SmartImageProps) {
  // Check if it's a data URL (base64)
  const isDataUrl = src.startsWith('data:');
  
  if (isDataUrl) {
    // Use regular img tag for data URLs
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit: 'cover' }}
      />
    );
  }
  
  // Use Next.js Image component for regular URLs
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
