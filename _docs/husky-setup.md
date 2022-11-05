# Setting up pre-commit and pre-push hooks

Install husky and lint-staged:

```bash
npx husky-init && yarn
yarn add -D lint-staged
```

Add `.lintstagedrc.json` file to the root of the project:

```json
{
  "*.ts": [
    "eslint"
  ],
  "*.html": [
    "eslint"
  ],
  "*.{js,ts,scss,css,json,html}": "prettier --write"
}
```

Modify `.husky/pre-commit` to execute linting on commits:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn -s lint-staged
```

Add a pre-push hook `.husky/pre-push` to execute tests on pushes:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn test
```

Make the pre-push script executable if it is not yet:

```bash
chmod ug+x .husky/pre-push
```
