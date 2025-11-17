// Allow side-effect imports of global CSS files
declare module "*.css";

// Provide types for CSS Modules as well
declare module "*.module.css" {
  const classes: { [className: string]: string };
  export default classes;
}

declare module "*.scss";

declare module "*.module.scss" {
  const classes: { [className: string]: string };
  export default classes;
}
