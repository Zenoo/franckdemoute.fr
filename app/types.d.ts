declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>> & {
    src: string;
  };
  export default content;
}

declare module "*.png";