# Local Setup and Testing

This guide covers installing Node.js, checking that npm is available, installing project dependencies, and running the main local test commands.

## 1. Install Node.js

Download and install the current **LTS** version of Node.js from the official Node.js website:

```text
https://nodejs.org/
```

Node.js includes **npm**, so you normally do not need to install npm separately.

After installation, close and reopen your terminal or VS Code so the new commands are available.

## 2. Check Node.js and npm

Open a terminal and run:

```bash
node --version
```

Then check npm:

```bash
npm --version
```

If both commands print version numbers, Node.js and npm are installed correctly.

Example:

```text
v24.x.x
11.x.x
```

If either command says it is not recognized or not found, restart your terminal first. If it still fails, reinstall Node.js and make sure it is added to your system PATH.

## 3. Install Project Dependencies

Open the project folder in VS Code, then open a terminal in the repository root.

The terminal should be in the folder containing:

```text
package.json
package-lock.json
src/
```

Install the dependencies with:

```bash
npm install
```

For a clean install using the exact versions in `package-lock.json`, you can instead use:

```bash
npm ci
```

`npm ci` is especially useful when checking that the repository builds correctly from a clean state.

## 4. Validate Content

Run:

```bash
npm run validate
```

This checks the project's content files for problems such as invalid JSON, incorrect references, invalid IDs, or other supported content-validation errors.

If validation succeeds, the command should finish without an error.

Fix any reported validation errors before submitting your changes.

## 5. Test the Production Build

Run:

```bash
npm run build
```

This performs the full production build.

Use this before submitting changes to make sure the website can build successfully.

A successful build should complete without errors.

## 6. Run the Development Server

Run:

```bash
npm run dev
```

This starts the local development version of the site.

The terminal will print a local address, usually similar to:

```text
http://localhost:4321/
```

Open that address in your browser to preview your changes.

Keep the terminal running while using the development site.

To stop the development server, press:

```text
Ctrl+C
```

## Recommended Check Before Submitting

Before submitting or pushing content changes, run:

```bash
npm run validate
npm run build
```

If both commands succeed, you can also use:

```bash
npm run dev
```

to visually check that your changes display correctly on the site.

## Quick Reference

```bash
node --version
npm --version

npm install

npm run validate
npm run build
npm run dev
```
