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

The project uses Expo SDK 57. Expo's docs say to use an SDK 57 project when testing in Expo Go on a physical device, because the Expo Go app on the phone stores must match the project's SDK version.

## Check it

- `npm test` runs the unit tests for money, dates, ledger totals, sample data and the store.
- `npx tsc --noEmit` type-checks.
- `npx expo lint` lints.

## Decisions

Amounts are whole paise stored as `bigint`, and the only currency is INR, as the [domain model](../../docs/04-domain-model.md) requires. Colors, type and spacing live in `src/theme.ts`, copied from the brand tokens in [assets/brand](../../assets/brand). The app is locked to light mode because the brand has no dark theme.
