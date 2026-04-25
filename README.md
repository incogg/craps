# Dealer Payout Training

![Home Screen](assets/Home%20Screen.png)

A static web tool for casino dealers to drill payout math for **Craps**, **Roulette**, and **Baccarat**.

## How it works

1. A random bets are generated and shown on the table layout
2. You calculate the correct payout mentally
3. Type your answer and submit
4. Correct/incorrect feedback is shown, with the right payout revealed if you missed it
5. Tap "Next Round" for a new scenario

## Games

| Game | Status | Coverage |
|---|---|---|
| Craps | Live | Horn bets (Any Seven, Any Craps, Horn High, Horn numbers) |
| Roulette | Coming soon | Inside bets |
| Baccarat | Coming soon | Dragon/Tiger |

## Stack

- **Vue 3** (Composition API) + **Vue Router**
- **Vite** build tooling

## Setup

Requires Node `^20.19.0` or `>=22.12.0`.

```bash
npm install
npm run dev       # dev server with HMR
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

## Difficulty

A difficulty dock on each game page adjusts the wager range used when generating scenarios. Selection is persisted to `localStorage`.
