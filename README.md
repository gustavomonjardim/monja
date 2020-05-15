# Monja
Implementing my own version of React.

## Introduction

This project aims to build a simplified version of the [React framework](https://github.com/facebook/react). Particularly, its reconciliation algorithm and the Fiber architecture.

Based on [@pomber](https://github.com/pomber/didact)`s [Didact](https://github.com/pomber/didact).

## Features

- Functional components.
- JSX support.
- `useState` hook.
- `useEffect` hook.
- Reconciliation by key.
- Style prop as object.

## Run locally

1. Clone the project

```shell
$ git clone https://github.com/gustavomonjardim/monja.git
```

2. Install the dependencies:

```shell
$ yarn
```

3. Run the project on watch mode

```shell
$ yarn start
```

4. Build the package

```shell
yarn build
```

## Run an example Todo App

```shell
yarn start:example
```


## Tools

This project is bundled with [rollup](https://rollupjs.org).

## Helpful resources 

- [Build your own React](https://pomb.us/build-your-own-react/) - A Step by step tutorial teaching you how to build your own version of react.
- [React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/) - A deep dive into React by [Dan Abramov](https://twitter.com/dan_abramov).
- [Inside Fiber: in-depth overview of the new reconciliation algorithm in React](https://indepth.dev/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react/) - A deep dive into React`s reconciliation algorithm by [Max Koretskyi](https://twitter.com/maxkoretskyi).
- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture) - An introduction to React Fiber by [Andrew Clark](https://twitter.com/acdlite).
- [A Cartoon Intro to Fiber](https://www.youtube.com/watch?v=ZCuYPiUIONs) - A talk about React Fiber by [Lin Clark](https://twitter.com/linclark) at React Conf 2017. 

## Future works

- Add static typing with Typescript

## License

Licensed under the [MIT License](./LICENSE).