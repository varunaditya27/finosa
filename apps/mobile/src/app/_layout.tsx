import { FamiljenGrotesk_400Regular, FamiljenGrotesk_500Medium, FamiljenGrotesk_600SemiBold, FamiljenGrotesk_700Bold } from "@expo-google-fonts/familjen-grotesk";
import { Petrona_500Medium, Petrona_600SemiBold } from "@expo-google-fonts/petrona";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { LedgerProvider } from "@/store/ledger-store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    FamiljenGrotesk_400Regular,
    FamiljenGrotesk_500Medium,
    FamiljenGrotesk_600SemiBold,
    FamiljenGrotesk_700Bold,
    Petrona_500Medium,
    Petrona_600SemiBold,
  });

  useEffect(() => {
    // Hide on error too, so a font failure falls back to system fonts instead of a stuck splash.
    if (loaded || error) SplashScreen.hide();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <LedgerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="add-transaction" options={{ presentation: "modal" }} />
        <Stack.Screen name="add-account" options={{ presentation: "modal" }} />
      </Stack>
    </LedgerProvider>
  );
}
