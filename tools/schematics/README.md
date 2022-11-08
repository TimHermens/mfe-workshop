# Senses Schematics

Always use the Angular Command line Interface (CLI) to scaffold your code and get started on any task. The Angular CLI uses schematics to generate code. You can find more information on the basics of generating code with Angular Schematics here: https://angular.io/cli/generate

On top of that, we've created some extra Senses Schematics to serve our needs: We want to be able to quickly scaffold Apps, Pages and Features.

There is a nice [screenrecording available on Confluence](https://confluence.dev.rabobank.nl/display/TT/Schematics+demo) that demonstrates working with our Schematics

```bash
# To generate a new App
$> yarn nx generate app

# To generate a new PageComponent
# (ends up in /libs/pages/..<child-page>/<name-page>
$> yarn nx generate page

# To generate a FeatureComponent
# (ends up in /libs/features/<product-category>/<name-feature>
$> yarn nx generate feature

```

## Available schematics

Within the monorepo we use the default NX and Angular schematics.

We've also created new schematics and parameters for the existing ones that make it easier to work within Senses monorepo.

These are the new schematics created for Senses projects:

- app: creates new apps under `/apps`
- page: creates new page under `/libs/pages`
- feature: creates new feature under `/libs/features`

## Naming

Code generated with Senses schematics follows the following convention for naming:

- The Class name is _classified_, i.e. `my-cool-feature` gets transformed to `MyCoolFeature`
- The files are the _dasherized_ form of their name, i.e. generating a service called `MyCoolFeature` will generate files with names like `my-cool-feature.ts`
- Application names must be shorter than 40 characters.

## Folder structure for pages

The convention is that each page is stored in _index folder. This is to have a folder structure that is nested but also remove overlapping dependency on parent pages and make the NX dep-graph see each of those project pages in a more isolated way so it prevents it from treating the entire parent page structure as affected when only a child page is affected and will prevent "nested projects".

The folder structure, when generating a new page and created with a parent page, will therefor look like for example: `libs/pages/rbo/betalen/new-child-page/_index/`. The parent page will also have its own `_index` folder: `libs/pages/rbo/betalen/_index/`.

## Getting Started With schematics

To run a schematic us:

```bash
ng generate <name-schematic> [options]
```

For example to add an page to the repo use:

```bash
ng generate page --name=my-page-name --app=rbo
```

## Available schematics

Get a list with available schematics with:

```bash
ng generate --list-schematics
```

or have a look in `./src/collection.json`.

## Help for a schematic

Get help for a specific schematic with:

```bash
ng generate <name-schematic> --help
```

or have a look in `./src/<name-schematic>/schema.json`.

## Common errors

### Cannot find module

Cannot find module '{root}/senses/tools/schematics/src/{name-schematic}'

Probably the schematics are not build. Within the ./tools/schematics/src/ there're only .ts files and no .js file.

Rebuild the schematics with `yarn nx build schematics`

### not found in collection

Schematic "{some-name}" not found in collection "./tools/schematics/src/collection.json".

You probably misspelled the schematic name

# Developing Schematics

## Build

```bash
yarn nx build schematics
```

## Unit Testing

```bash
yarn nx test schematics
```

## Debugging

for debugging a schematic use:

```bash
 node --inspect-brk $(which schematics) .:<name-schematic> [options]
```

to debug nx cli way:

```bash
node --inspect-brk $(which ng) generate name-schematic[options]
```

you could add `debugger;` to your script to break, or setup VS or WebStorm debug session and add breakpoints in your script
