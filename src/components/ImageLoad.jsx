"use client";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import React from "react";

const ImageLoad = ({
  src,
  title,
  width = 200,
  height = 200,
  fill = false,
  fit = false,
  className,
  style,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  return (
    <div className="relative ">
      {!imageLoaded && (
        <div className="absolute text-black flex w-full items-center justify-center h-full">
          <CircularProgress />
        </div>
      )}

      <Image
        src={src ?? "/images/no-photo.png"}
        {...(fill || fit ? {} : { height })}
        {...(fill || fit ? {} : { width })}
        title={title}
        onLoad={(e) => {
          setImageLoaded(true);
        }}
        alt={title ?? "image"}
        className={`${className}`}
        style={style}
        fill={fill}
        fit={fit.toString()}
      />
    </div>
  );
};

export default ImageLoad;
