<div align="center">

# FinOSA mobile mock

A React Native app with made-up data, used to try the screens before any backend exists.

</div>

## What it shows

Four screens and two forms: Overview (monthly totals and spending by category), Accounts, History (with a category filter), Add transaction and Add account. Every balance and total is worked out from the records in memory by tested functions, so a figure can always be traced back to its transactions. Data resets when the app restarts. No bank is connected.

## Run it

From this folder:

1. `npm install`
2. `npx expo start`
3. On an Android phone, install Expo Go, then scan the QR code shown in the terminal. Press `w` in the terminal to open the web preview instead.

The phone and the computer must be on the same Wi-Fi network, with mobile data off on the phone. Expo Go also has to match the project's Expo SDK version exactly. This project uses SDK 58, the version the Play Store's Expo Go currently supports. If Expo Go reports that the project is incompatible, the two versions differ: update Expo Go, or install the build for this SDK from [expo.dev/go](https://expo.dev/go).

## Check it

- `npm test` runs the unit tests for money, dates, ledger totals, sample data and the store.
- `npx tsc --noEmit` type-checks.
- `npx expo lint` lints.

## Decisions

Amounts are whole paise stored as `bigint`, and the only currency is INR, as the [domain model](../../docs/04-domain-model.md) requires. Colors, type and spacing live in `src/theme.ts`, copied from the brand tokens in [assets/brand](../../assets/brand). The app is locked to light mode because the brand has no dark theme.
