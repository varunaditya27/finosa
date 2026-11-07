import { Tabs } from "expo-router";
import { AppText } from "@/components/app-text";
import { Icon, type IconName } from "@/components/icon";
import { colors, fonts } from "@/theme";

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: "index", title: "Overview", icon: "overview" },
  { name: "accounts", title: "Accounts", icon: "accounts" },
  { name: "history", title: "History", icon: "history" },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.hairline },
      }}
    >
      {TABS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ focused }) => <Icon name={icon} color={focused ? colors.ink : colors.muted} />,
            tabBarLabel: ({ focused }) => (
              <AppText style={{ fontFamily: focused ? fonts.bold : fonts.medium, fontSize: 12, lineHeight: 14 }} color={focused ? colors.ink : colors.muted}>
                {title}
              </AppText>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
