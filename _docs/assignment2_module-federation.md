# Assignment 2: Module Federation

In this assignment, you will transform the architecture of the `flight-app` application to a Micro
Frontend architecture.

The goal of this assignment is to split every domain to its own application. These domain
applications will act as the so-called `remote` applications.

The existing `flight-app` application will act as the so-called `host` / `shell` application which ties
all the domain applications together.

## Checkout

---

### Option 1

Checkout the branch `assignment2` and create a new branch you can freely work on:

```bash
git checkout -b your-unique-branch origin/assignment2
```

The `assignment2` branch contains my own Domain-Driven Design (DDD) solution you can use for this
assignment.

### Option 2

Alternatively, you can also continue with your own DDD solution instead if you managed to fully implement that.
But take into account that this assignment has been written in such a way that is easier to
follow if you use my DDD solution.
