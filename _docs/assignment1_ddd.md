# Assignment 1: Domain-Driven Design (DDD)

In this assignment, you will transform the monolithic design of the `flight-app` application
to a Domain-Driven Design that integrates well with NX.

The goal of this assignment is to split up the functionalities and components of the app to
fitting domains. 

## Step 1: Create new branch and yarn

Please create a new branch on top of the `main` branch you can freely work on.

```bash
git checkout -b your-unique-branch origin/main
```

If you haven't installed the npm packages yet, then please install them in the meantime:

```bash
yarn
```

## Step 2: Identify the domains

Let's start with firing up the app to see what we work with:

```bash
yarn run json-server
nx serve flight-app
```

One of my preferred methods to identify important domains in a front-end application is to look
for all the root pages of the app. Every nested page is a child of a root page and therefore
also a member of the same domain.

Another good place to look for domains is the app's main routing module located at:
`apps/flight-app/src/app/app-routing.module.ts`. You might be able to find more root pages
here that could be part of other domains.

With these two approaches you should be able to identify a number of domains that will contain
a big chunk of the application's logic. Any other logic that does not fit within these domains
could either be part of:

- A new domain to group similar functionality together
- The `shared` domain: this is a domain that should only contain globally shared functionality.
  One of the common mistakes is to add functionality of one domain in this `shared` domain just
  for the sake of sharing and using that functionality in another domain. If functionality of
  a domain needs to be shared, share it in the API part of your domain instead!

So one of the domains will be <u>**the**</u> `shared` domain. I emphasize "the" because there
should always be exactly 1 shared domain when implementing a Domain-Driven Design. Any other
thing that needs to be shared will be part of an API within one of the domains.

Now go ahead and identify the other domains.

## Step 3: Generate domain projects

If you are confident with your identified domains, you can start generating domain projects
for them. I have added a custom CLI schematic with a bunch of custom generators you can use
to generate the projects. The schematics can be found at `tools/schematics`.

This is the command to generate a domain project:

```bash
nx g domain --name your-domain-name
```

You do not have to generate a domain project for the `shared` domain.

### So what is generated?

1. A new domain project is generated at `libs/your-domain-name/domain`
   1. The tags `domain:your-domain-name` and `type:domain-logic` are added to the project's
      `project.json` file. These tags are used by the **@nrwl/nx/enforce-module-boundaries** lint
      rule. See the next section for more information about this.
   2. The `src/lib` folder contains three folders:
      1. **application:** contains facades of your data services to encapsulate domain logic complexity
      2. **entities:** contains models and interfaces
      3. **infrastructure:** contains data services to fetch data
2. An alias import path is created in the `tsconfig.base.json` file. You will be able to
   import the project with this alias import in other projects.
3. A `domain:your-domain-name` tag is added to the `.eslintrc.json` file as a child of the
   **@nrwl/nx/enforce-module-boundaries** lint rule. See the next section for more information about
   this.

### The .eslintrc.json file and `@nrwl/nx/enforce-module-boundaries` lint rule

This file contains all the enabled lint rules. You can find one explicitly defined lint rule here:
**@nrwl/nx/enforce-module-boundaries**. This rule already contains some configurations for the
`depConstraints` property for various tags. This configuration sets up the import boundaries
within the app. It will prevent developers from importing a project if the
project's tag would violate the import boundary constraints.

You can see a bunch of `type:` related tags. You can use these tags to identify the type of
project:

- `type:app`: use this tag for your main app projects
- `type:page`: use this tag for your page projects. Yes you read that right, every page will
  be contained in its own project. This will be very useful for affected integration testing.
- `type:feature`: use this tag for you feature projects. Features typically are smart components.
- `type:api`: use this tag for your API projects. API projects are used as a gateway to share
   functionality of a domain with other domains.
- `type:ui`: use this tag for your ui projects. UI typically is a collection of dumb presentational
  components.
- `type:domain-logic`: use this tag for your domain projects. A domain project contains the domain's
  business logic like models, interfaces, data, services, etc.
- `type:util`: use this tag for your utility projects. A utility project contains useful helper
  functions you need on multiple places.

These are the import constraints for the `type:` tags:

| Project tagged as | May only import projects tagged as                                            |
|-------------------|-------------------------------------------------------------------------------|
| type:app          | type:page / type:api / type:feature / type:ui / type:domain-logic / type:util |
| type:page         | type:page / type:api / type:feature / type:ui / type:domain-logic / type:util |
| type:feature      | type:api / type:ui / type:domain-logic / type:util                            |
| type:api          | type:ui / type:domain-logic / type:util                                       |
| type:ui           | type:domain-logic / type:util                                                 |
| type:domain-logic | type:util                                                                     |
| type:util         | type:util                                                                     |

There are also two `domain:` related tags:

- `domain:shared`: this is the 1 shared domain within the entire project.
- `domain:flight-app`: this is the domain of the existing flight-app app project.

These are the import constraints for the `domain:` tags:

| Project tagged as | May only import projects tagged as  |
|-------------------|-------------------------------------|
| domain:shared     | domain:shared                       |
| domain:flight-app | domain:flight-app / domain:shared   |

When we combine the `type` and `domain` tags, we can very accurately define what the import boundaries
should look like. It forces developers to only share functionality within the constraints of these
boundaries, preventing a complete entangled mess.

## Step 4: Generate util projects

Figure out if you need an util project for the shared domain and generate it:

```bash
nx g util --domain shared
```

Also do this for the other domains if applicable:

```bash
nx g util --domain your-domain-name
```

### So what is generated?

1. A new util project is generated at `libs/your-domain-name/util`
   1. The tags `domain:your-domain-name` and `type:util` are added to the project's
      `project.json` file.
2. An alias import path is created in the `tsconfig.base.json` file. You will be able to
   import the project with this alias import in other projects.

## Step 5: Generate ui projects

Figure out if you need an ui project for the shared domain and generate it:

```bash
nx g ui --domain shared
```

Also do this for the other domains if applicable:

```bash
nx g ui --domain your-domain-name
```

### So what is generated?

1. A new ui project is generated at `libs/your-domain-name/ui`
   1. The tags `domain:your-domain-name` and `type:ui` are added to the project's
      `project.json` file.
2. An alias import path is created in the `tsconfig.base.json` file. You will be able to
   import the project with this alias import in other projects.

## Step 6: Generate api projects

It does not make sense to generate an API project for the shared domain. So just figure out if
you need API projects for the other domains. You can skip this step if you are unsure.

```bash
nx g api --domain your-domain-name
```

### So what is generated?

1. A new API project is generated at `libs/your-domain-name/api`
   1. The tags `domain:your-domain-name`, `domain:your-domain-name-api` and `type:api` are added
      to the project's `project.json` file.
      > This second domain tag is very important. If you want to import this API in another domain,
        you have to add this api domain tag to the allowed dependencies of that domain in the file
        `.eslintrc.json`. So essentially you have to give explicit access to use the API.
2. An alias import path is created in the `tsconfig.base.json` file. You will be able to
   import the project with this alias import in other projects.

## Step 7: Generate feature projects

Ideally, you should not need feature projects in the shared domain. So just figure out if
you need feature projects for the other domains.

```bash
nx g feature --name your-feature-name --domain your-domain-name
```

### So what is generated?

1. A new feature project is generated at `libs/your-domain-name/features/your-feature-name`
   1. The tags `domain:your-domain-name` and `type:feature` are added to the project's
      `project.json` file.
2. An alias import path is created in the `tsconfig.base.json` file. You will be able to
   import the project with this alias import in other projects.

## Step 8: Generate page projects

It does not make sense to add page projects in the shared domain. So just figure out if
you need page projects for the other domains.

```bash
nx g page --name your-page-name --domain your-domain-name
```

This command will also prompt you for a parent page project name. You can simply press enter
to create the page as a root page. Or enter the page's project name to generate the page as
a nested page.

You can find the page's project name in the `project.json` file of the page
project. So it's important to start with generating the root page projects first.

### So what is generated?

1. A new page project is generated at:
   1. root page: `libs/your-domain-name/pages/your-page-name/_index`
   2. nested page: `libs/your-domain-name/pages/parent-page-name/your-page-name_index/_index`
2. The tags `domain:your-domain-name` and `type:page` are added to the project's
   `project.json` file.
3. An alias import path is created in the `tsconfig.base.json` file. You will be able to
   import the project with this alias import in other projects.
4. In case a nested page was generated, this page is automatically imported by the parent page.

## Step 9: Move the functionality to the appropriate projects

> ### Important note
>
> From this point onwards you require some Angular knowledge. So if you get stuck on this step or the
following steps, don't be afraid to ask for help. You could also decide to move to the next
assignment where you will continue working on a branch where the Domain-Driven Design
has been fully implemented. But I recommend giving this first assignment a try because you will learn
some valuable lessons.

You should have generated all the required projects now. You can start copying the functionality
of the `flight-app` project and pasting it to the relevant generated projects. I would highly
recommend adding the functionality to the projects in the following order:

1. Shared domain
   1. Util
   2. Ui
2. Other domains
   1. Domain-logic
   2. Util
   3. Ui
   4. Api
   5. Features
   6. Pages

Make sure that you update the project's `index.ts` file with all the necessary exports to expose <u>**everything**</u>
within the project! This is an important requirement for the <u>**buildable**</u> generated libs. You can also check
if you exported everything by simply running the build command:

```bash
nx build your-project-name
```

The only exception to this *"Export everything in your `index.ts` file"* rule are the API projects.
In API projects you only want to export the minimum amount of things you need to share with other domains.

But there is a little tricky technical catch with Angular though when you
export Angular Modules. If your API exports any Angular Module, then you also need to make sure the API exports
every custom Angular Component/Directive that this Module has declared in the `declarations: []` list.
Otherwise, Angular will throw an error when it tries to resolve those components at run-time.

Also make sure that you change every erroneous import to the new alias imports found at `tsconfig.base.json`.

It is now also a good time to track if you introduced any lint violations in the project:

```bash
nx lint your-project-name --watch
```

Violations could indicate that:

1. You have made a mistake with importing the wrong project(s), or
2. It is a sign that you need to add a missing API project, or
3. You forgot to whitelist the usage of an API in the `.eslintrc.json` file

## Step 10: Update the routing

Go to `apps/flight-app/src/app/app-routing.module.ts` and change the imports of the paths to your
generated root page projects. Use the alias import paths that were generated in the `tsconfig.base.json`
file.

Also make sure that the routing is correct in your page projects.

## Step 11: Test-run the application

Let's make sure you do not have any lint errors such as boundary violations:

```bash
nx run-many --target=lint --all --exclude=schematics
```

If not, then you should try running the app:

```bash
yarn run json-server
nx serve flight-app
```

If everything works as expected, then you have completed this assignment!

### Dependency graph

One last nice thing you can check is what the dependency graph looks like now:

```bash
nx graph
```

You can click on the magnifying glass next to a project to show its dependency graph. Use the
proximity settings to increase or decrease the depth of the graph.
