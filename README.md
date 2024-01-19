[Try it out](https://vizua3d.github.io/ArcelorMittalDemo/)

# How to launch
```
npm start
```
sources are inside the public folder.

# Used frameworks
- VanillaJS components (not a framework) see [./public/js/components](./public/js/components)
- [Flowbite](https://flowbite.com/docs/customize/icons/) on top of [Tailwincss](https://tailwindcss.com/docs/installation)
- [Fontawesome v5](https://fontawesome.com/v5/search)
- [browser-sync](https://browsersync.io/)

## About Flowbite
Current [flowbite v2.2.1 css](https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js) seems to be tailwindcss v3.3.5 but as a css file instead of a JS as you are welcome to use it from [the tailwindcss quick start](https://tailwindcss.com/docs/installation/play-cdn).  
So here we just do not use [flowbite v2.2.1 css](https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js) but instead we use [tailwindcss v3.3.5](https://cdn.tailwindcss.com/3.4.1) JS file.

And we use [flowbite v2.2.1 JS file](https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js) to get their component bindings like the Modal for example.

## About cutom VanillaJS components
https://mellowdevs.medium.com/web-components-using-vanilla-js-f7af00834caa
https://coderpad.io/blog/development/intro-to-web-components-vanilla-js/

## About Github Pages<>
The "Try it out" is published as Github Pages from https://github.com/vizua3d/ArcelorMittalDemo/tree/gh-pages.

[ArcelorMittalDemo](https://github.com/vizua3d/ArcelorMittalDemo) repository is a public mirror of the [ArcelorMittal](https://github.com/vizua3d/ArcelorMittal) private repository. To sync the mirror, run the following command from the [ArcelorMittal](https://github.com/vizua3d/ArcelorMittal) private repository:
```
git push --mirror git@github.com:vizua3d/ArcelorMittalDemo.git
```

Then you need to sync the gh-pages branch, which is a subtree of the master branch. To do so use the following command from the master branch:
```
git subtree push --prefix public origin gh-pages
```
