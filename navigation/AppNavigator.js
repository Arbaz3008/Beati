import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider,useTheme } from '../theme/ThemeContext';



// Screens
import HomeScreen from '../screens/HomeScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SongDetailScreen from '../screens/SongDetailScreen';
import PlaylistScreen from '../screens/PlaylistScreen';
import EqualizerScreen from '../screens/EqualizerScreen';
import DjModeScreen from '../screens/DjModeScreen';
import AlbumScreen from '../screens/AlbumScreen';
import ArtistScreen from '../screens/ArtistScreen';
import Search from '../screens/Search';
import Equalizer from '../components/Equalizer';
import LyricsViewer from '../components/LyricsViewer';
import WalletScreen from '../screens/WalletScreen';
import SleepTimer from '../components/SleepTimer';
import Share from '../screens/Share'
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigators
function HomeStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: theme.background }
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SongDetail" component={SongDetailScreen} />
      <Stack.Screen name="Playlist" component={PlaylistScreen} />
      <Stack.Screen name="Album" component={AlbumScreen} />
      <Stack.Screen name="Artist" component={ArtistScreen} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Equalizer" component={Equalizer} />
      <Stack.Screen name="Lyrics" component={LyricsViewer} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Sleep" component={SleepTimer} />
     

    </Stack.Navigator>
  );
}

function PlaylistsStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: theme.background }
      }}
    >
      <Stack.Screen name="PlaylistsMain" component={PlaylistsScreen} />
      <Stack.Screen name="Playlist" component={PlaylistScreen} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: theme.background }
      }}
    >
      <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
      <Stack.Screen name="SongDetail" component={SongDetailScreen} />
      
    </Stack.Navigator>
  );
}

function SettingsStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: theme.background }
      }}
    >
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="DjMode" component={DjModeScreen} />
      <Stack.Screen name="Equalizer" component={EqualizerScreen} />
       <Stack.Screen name="Share" component={Share} />
      
    </Stack.Navigator>
  );
}

// Tab Navigator
function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopWidth: 0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Playlists') iconName = 'list';
          else if (route.name === 'Favorites') iconName = 'heart';
          else if (route.name === 'Settings') iconName = 'settings';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Playlists" component={PlaylistsStack} />
      <Tab.Screen name="Favorites" component={FavoritesStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}

// Root App
export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </ThemeProvider>
  );
}