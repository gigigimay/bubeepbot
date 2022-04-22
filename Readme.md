# bubeepbot

Bubeep is a tiny discord bot who dreamed to conquer the world.

## Try bebeepbot!

- [Add `bubeepbot` to your server](https://discord.com/oauth2/authorize?client_id=707274116205641778&scope=bot)
- Type `b!help` in your channel. Bubeep should reply to you and list all available commands.

## Development Guide

### Prerequisite

- Package manager: [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)
- Runs with `Node` version >=16.6.0

### Environment variables
create `.env` file in your root directory and add values following the `.env.example`

### Install Dependencies

```
yarn
```

### Start development server

```
yarn dev
```

### Deployment

We use circleCI to trigger the deployment to Heroku

### Other notes

- For code formatting, add and enable `eslint` extension to your VSCode.
- [discord developer console](https://discord.com/developers/applications)
