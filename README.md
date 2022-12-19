# CLI Create Default Struture Project

<div align="center">

![Code Size](https://img.shields.io/github/languages/code-size/ramonpaolo/cli-create-default-project?style=flat-square)
![Code Size](https://img.shields.io/npm/dm/cli-create-default-project?style=flat-square)
![Code Size](https://img.shields.io/npm/l/cli-create-default-project?style=flat-square)

</div>

---

## Indice
- [What is it?](#what-is-it)
- [What technologies this project use?](#what-technologies-this-project-use)
- [How install it?](#how-install-it)
- [Example of use](#example-of-use)

---

## What is it?
This project, is a CLI make in Node.Js, that have the purpose to create default struture of a project CRUD in Express

---

## What technologies this project use?
- Node.Js
    - TypeScript
    - Yargs(lib)

---

## How install it?
It's simple, just you install the package as global or local, example:

```bash
# Installing package global

# Yarn
$ yarn global add cli-create-default-project

# npm
$ npm install -g cli-create-default-project
```
---
```bash
# Installing package local

# Yarn
$ yarn add cli-create-default-project

# npm
$ npm install cli-create-default-project
```

---

After you install the package, you can pass this params:

```bash
$ yarn create-project --docker --http2 --database postgres mongo redis --cloud firebase aws
```

---

Ok, but, what is this params?
```json
{
    "description": {
        "--docker": "if pass this flag, the docker is enabled in the project",
        "--http2": "if pass this flag, the http2(spdy) is enabled in the project(express)",
        "--database": {
            "description": "you can pass until 3 values to enable X database in the project",
            "values": ["postgres", "mongo", "redis"]
        },
        "--cloud": {
            "description": "you can pass until 2 values to enable X cloud provider(sdk) in the project",
            "values": ["firebase", "aws"]
        },
    }
}
```

---

## Example of use:
I want to create a project, with redis and docker enabled. What command I pass to the CLI create it for me?

```bash
$ yarn create-project --docker --database redis
```

After that this command finalize, you can see this struture of folders and files:

<center>

<img src="https://ik.imagekit.io/9t3dbkxrtl/Captura_de_Tela_2022-12-18_a%CC%80s_20.51.32_xiU1fXYSb.png?ik-sdk-version=javascript-1.4.3&updatedAt=1671407500410" alt="ScreenShot of a struture of folders and files" height="400">

</center>

###### Made with Love by Ramon Paolo Maram :3