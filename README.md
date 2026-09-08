# Color Tool

This project will facilitate generating color palletes for websites and apps and converting between different formats.

## References

[Realtime Colors](https://www.realtimecolors.com)

Generates Text, Background, Primary, Secondary, and Accent colors with component previews.

The Coolors app exports to a url like `https://coolors.co/palette/6f2dbd-a663cc-b298dc-b8d0eb-b9faf8` I'm pretty sure those are just the 5 hex colors.

ColorKit.co generates similar palette urls to Coolors `https://colorkit.co/palette/eebea0-ff8d83-ffa89f-ffc2bc-aaae80/`.

[UIColors](https://uicolors.app/generate/b49c2c) generates tailwind exports. Like tailwind 3```'lucky': {
  '50': '#faf9ec',
  '100': '#f4f1ce',
  '200': '#eae3a1',
  '300': '#decf6b',
  '400': '#d2bc40',
  '500': '#b49c2c',
  '600': '#a28425',
  '700': '#806420',
  '800': '#6a5121',
  '900': '#5b4521',
  '950': '#34250f',
}```

tailwind 4```--color-lucky-50: #faf9ec;
--color-lucky-100: #f4f1ce;
--color-lucky-200: #eae3a1;
--color-lucky-300: #decf6b;
--color-lucky-400: #d2bc40;
--color-lucky-500: #b49c2c;
--color-lucky-600: #a28425;
--color-lucky-700: #806420;
--color-lucky-800: #6a5121;
--color-lucky-900: #5b4521;
--color-lucky-950: #34250f;```

I want this app to Let users import any of these palette types and view them on standard components like realtime colors does. I want those components to be standard tailwind /react / angular / material / android / iOS like components. This will be a web appso having child web apps for the angular, react, and material versions seems doable. Android and iOS previews may be harder since we will have to approximate thenm with react components.

Also these themes use different numbers of colors with different names. I want us to be able to export usable theme files for tailwind, android, and ios. The other exports and previews are less important, but still I want to have them if possible. Our exports should be a single file, url, or copyable code block for each target. For tailwind I want to be able to add a single .css file to my project for the theme and have it be available to use in the app. Also a code snippet to add to import it and one to make it the default theme. If Android needs more than one xml file I want to give them a zipped download of resources they can copy into their project in the correct res/ tree. The url export will use a configurable base url so we can host it anywhere, but it should be a simple url to our app with that specific theme configured.

We may want to work with other themable attributes later like gradients, images, borders, etc...

When previewing the user should be able to select or hide targets. Like if they only want to see tailwind or android, then they shouldn't have to see the others. This can be something that switches between preview targets and shows them one at a time or something that allows the user to show or hide individual ones.

For now assume the project name is ThemeTool and will be hosted as a github page for the user headhunter45 at either "headhunter45.github.io" or "headhunter45.github.io/themetool"
