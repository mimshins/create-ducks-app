export type PackageManager = "npm" | "pnpm" | "yarn";

export type Package = {
  name: string;
  version: string;
  description: string;
  license: string;
  type: string;
  scripts: Record<string, string>;
  devDependencies: Record<string, string>;
};

export type DucksConfig = {
  /**
   * The name of the application.
   *
   * This will be used for open-graph and html meta purposes.
   */
  name: string;
  /**
   * A string in which you can explain what the application does.
   */
  description: string;
  /**
   * The social networks related to the application.
   */
  socials?: {
    /**
     * The url to the twitter account.
     */
    twitter?: string;
    /**
     * The url to the github repository.
     */
    github: string;
  };
  /**
   * A web application manifest.
   *
   * This provides information that the browser needs to install this app as
   * a Progressive Web Application (PWA) on a device.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/Manifest} For further information
   */
  manifest?: {
    /**
     * A string that represents the name of the web application as it is
     * usually displayed to the user.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/Manifest/name} For further information
     */
    name: string;
    /**
     * A string that defines the default theme color for the application
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/Manifest/theme_color} For further information
     */
    theme_color?: string;
    /**
     * A string that represents the name of the web application displayed
     * to the user if there is not enough space to display `manifest.name`.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/Manifest/short_name} For further information
     */
    short_name: string;
    /**
     * A string in which developers can explain what the application does.
     *
     * If not provided we will use `config.description` as the fallback value.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/Manifest/description} For further information
     */
    description?: string;
    /**
     * A string that represents the start url of the web application.
     *
     * This is the preferred url that should be loaded when the user launches
     * then web application.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/Manifest/start_url} For further information
     */
    start_url?: string;
    /**
     * A string that determines the developers' preferred display mode
     * for the website.
     *
     * The display mode changes how much of browser UI is shown to the user
     * and can range from `browser` (when the full browser window is shown)
     * to `fullscreen` (when the app is fullscreened).
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/Manifest/display} For further information
     */
    display: "fullscreen" | "standalone" | "minimal-ui" | "browser";
    /**
     * An array of objects representing image files that can serve as
     * application icons for different contexts.
     *
     * The display mode changes how much of browser UI is shown to the user
     * and can range from `browser` (when the full browser window is shown)
     * to `fullscreen` (when the app is fullscreened).
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/Manifest/icons} For further information
     */
    icons: Array<{
      /**
       * The path to the image file.
       * If src is a relative URL, the base URL will be the URL of the manifest.
       */
      src: string;
      /**
       * A string containing space-separated image dimensions using
       * the same syntax as the
       * [sizes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#sizes)
       * attribute.
       */
      sizes: string;
      /**
       * A hint as to the media type of the image.
       * The purpose of this member is to allow a user agent to quickly ignore
       * images with media types it does not support.
       */
      type?: string;
      /**
       * Defines the purpose of the image.
       */
      purpose?: "monochrome" | "maskable" | "any";
    }>;
  };
};
