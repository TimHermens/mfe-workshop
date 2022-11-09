# Additional stuff

---

Congratulations, you have made it to the end! Here are some other awesome features that are also
readily available thanks to NX and our implemented Domain-Driven Design.

## Extra package.json commands

---

You may have noticed some extra commands in the root package.json file, notably the `affected` commands.
The `affected` commands will run specific targets (build / test / lint / etc.) on ALL affected
projects. A project is marked as affected if:

1. The project has been modified in any way, OR
2. Any of the project's dependencies have been modified in any way, OR
3. Any of the global implicit dependencies (such as the root package.json file) have been modified
   in any way (see `nx.json` for the global implicit dependencies), OR
4. Any of the project-specific implicit dependencies have been modified in any way. A project-specific implicit
   dependency can be configured in the `project.json` file. For example, see the `project.json`
   file of the `flight-app-e2e` project. This project's implicit dependency is `flight-app`.

The affected changes are determined by comparing a project's hash state with the hash state on
the configured base git branch. In this project the base git branch is the `main` branch (see `nx.json`).

Try changing the defaultBase branch to your current branch name. Create a new branch and modify a
project. Then run any of the `affected` commands you are interested in (e.g. `yarn run affected:lint`).
The command should only target the affected projects.

## Affected integration tests

---

Also notice that there is a `affected:e2e` command that invokes a custom script. I have created this
custom script to showcase how you could also implement affected integration testing. It involves
creating `*.spec.affected.json` files alongside the `*.spec.ts` integration test files that
provide metadata when a specific integration test file should run. You basically configure which
affected projects should trigger the integration test file. If you know your integration test only
tests a specific page, then you could configure the `*.spec.affected.json` with the page project.

For instance, assume we have a `home-page.spec.ts` integration test file that exclusively tests
the home page of the `home` domain. We can make sure that this integration test file only runs if that
specific page has been modified:

```json
{
   "affectedProjects": [
      "home-page-home"
   ]
}
```

Integration tests are complex, resource-heavy, long-running tests, so it helps a lot if we can prevent
running a number of them this way.
