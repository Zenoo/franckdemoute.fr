"use client"

import Lottie from "lottie-react";

export interface AnimationLottieProps {
  animationPath: Record<string, unknown>;
};

export const AnimationLottie = ({ animationPath }: AnimationLottieProps) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: {
      width: '95%',
    }
  };

  return (
    <Lottie {...defaultOptions} />
  );
};