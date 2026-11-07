/**
 * The Spot - Master Root Navigator & Navigation Shell
 */

import React, { useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { BottomNav, MainTabType } from '../components/navigation/BottomNav';

// Screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { AuthScreen } from '../screens/auth/AuthScreen';
import { OnboardingInterestsScreen } from '../screens/auth/OnboardingInterestsScreen';
import { LocationPermissionScreen } from '../screens/auth/LocationPermissionScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ExploreScreen } from '../screens/explore/ExploreScreen';
import { EventDetailsScreen } from '../screens/event/EventDetailsScreen';
import { CreateEventModal } from '../screens/event/CreateEventModal';
import { GamingHubScreen } from '../screens/gaming/GamingHubScreen';
import { GamingSessionDetailsScreen } from '../screens/gaming/GamingSessionDetailsScreen';
import { CreateGamingModal } from '../screens/gaming/CreateGamingModal';
import { SquadDetailsScreen } from '../screens/squad/SquadDetailsScreen';
import { CommunityDetailsScreen } from '../screens/community/CommunityDetailsScreen';
import { InboxScreen } from '../screens/inbox/InboxScreen';
import { ChatDetailScreen } from '../screens/inbox/ChatDetailScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { HostDashboardScreen } from '../screens/host/HostDashboardScreen';
import { CreateChoiceModal } from '../screens/create/CreateChoiceModal';
import { LocationPickerModal } from '../components/common/LocationPickerModal';
import { FilterModal } from '../components/common/FilterModal';

// Models
import { EventItem } from '../types/event';
import { GamingSession } from '../types/gaming';
import { Squad } from '../types/squad';
import { Community } from '../types/community';
import { Conversation } from '../types/chat';

type AuthStep = 'welcome' | 'auth' | 'interests' | 'location' | 'app';

export const RootNavigator: React.FC = () => {
  const {
    isAuthenticated,
    isOnboarded,
    login,
    logout,
    completeOnboarding,
    selectedNeighborhood,
    setSelectedNeighborhood,
  } = useAuth();

  const { conversations } = useApp();

  // Auth & Onboarding Flow Navigation State
  const [authStep, setAuthStep] = useState<AuthStep>(
    !isAuthenticated ? 'welcome' : !isOnboarded ? 'interests' : 'app'
  );

  // Main Tabs State
  const [currentTab, setCurrentTab] = useState<MainTabType>('home');
  const [exploreInitialCategory, setExploreInitialCategory] = useState<string>('all');

  // Active Detail Route State
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedGamingSession, setSelectedGamingSession] = useState<GamingSession | null>(null);
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isHostDashboardOpen, setIsHostDashboardOpen] = useState(false);
  const [isGamingHubOpen, setIsGamingHubOpen] = useState(false);

  // Modals
  const [isCreateChoiceOpen, setIsCreateChoiceOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isCreateGamingOpen, setIsCreateGamingOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Temporary onboarding state
  const [tempInterests, setTempInterests] = useState<string[]>([]);
  const [tempGames, setTempGames] = useState<string[]>([]);

  // Calculate unread count
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Handle Tab Navigation with state reset
  const handleSelectTab = (tab: MainTabType) => {
    // Reset active details on tab switch
    setSelectedEvent(null);
    setSelectedGamingSession(null);
    setSelectedSquad(null);
    setSelectedCommunity(null);
    setActiveConversation(null);
    setIsHostDashboardOpen(false);
    setIsGamingHubOpen(false);
    setCurrentTab(tab);
  };

  // Create Flow Options
  const handleSelectCreateOption = (option: 'event' | 'gaming' | 'tournament' | 'community') => {
    if (option === 'event') {
      setIsCreateEventOpen(true);
    } else if (option === 'gaming' || option === 'tournament') {
      setIsCreateGamingOpen(true);
    } else {
      setIsCreateEventOpen(true);
    }
  };

  // Navigate to explore with preset category
  const handleNavigateToExplore = (category: string = 'all') => {
    if (category === 'gaming') {
      setIsGamingHubOpen(true);
      return;
    }
    setExploreInitialCategory(category);
    handleSelectTab('explore');
  };

  // Open Chat from Squad
  const handleOpenSquadChat = (squadId: string) => {
    const foundConv = conversations.find(c => c.relatedItemId === squadId);
    if (foundConv) {
      setSelectedSquad(null);
      setActiveConversation(foundConv);
    } else {
      handleSelectTab('inbox');
    }
  };

  /* ------------------- AUTH & ONBOARDING ROUTING ------------------- */

  if (!isAuthenticated && authStep === 'welcome') {
    return (
      <WelcomeScreen
        onGetStarted={() => setAuthStep('auth')}
        onLoginPress={() => setAuthStep('auth')}
      />
    );
  }

  if (!isAuthenticated && authStep === 'auth') {
    return (
      <AuthScreen
        onBack={() => setAuthStep('welcome')}
        onSuccess={() => {
          login();
          setAuthStep('interests');
        }}
      />
    );
  }

  if (authStep === 'interests') {
    return (
      <OnboardingInterestsScreen
        onContinue={(interests, games) => {
          setTempInterests(interests);
          setTempGames(games);
          setAuthStep('location');
        }}
        onSkip={() => {
          completeOnboarding([], [], 'Koregaon Park');
          setAuthStep('app');
        }}
      />
    );
  }

  if (authStep === 'location') {
    return (
      <LocationPermissionScreen
        initialNeighborhood={selectedNeighborhood}
        onComplete={(neighborhood) => {
          completeOnboarding(tempInterests, tempGames, neighborhood);
          setAuthStep('app');
        }}
      />
    );
  }

  /* ------------------- ACTIVE DETAIL OVERLAYS ------------------- */

  // 1. Host Dashboard
  if (isHostDashboardOpen) {
    return (
      <HostDashboardScreen
        onBack={() => setIsHostDashboardOpen(false)}
        onOpenCreate={() => setIsCreateEventOpen(true)}
        onEventPress={(evt) => setSelectedEvent(evt)}
      />
    );
  }

  // 2. Gaming Hub Full Screen
  if (isGamingHubOpen) {
    return (
      <GamingHubScreen
        onBack={() => setIsGamingHubOpen(false)}
        onSessionPress={(sess) => setSelectedGamingSession(sess)}
        onOpenCreateGaming={() => setIsCreateGamingOpen(true)}
      />
    );
  }

  // 3. Event Details
  if (selectedEvent) {
    return (
      <EventDetailsScreen
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
        onHostPress={() => {
          setSelectedEvent(null);
          setCurrentTab('profile');
        }}
      />
    );
  }

  // 4. Gaming Session Details
  if (selectedGamingSession) {
    return (
      <GamingSessionDetailsScreen
        session={selectedGamingSession}
        onBack={() => setSelectedGamingSession(null)}
        onOpenChat={() => {
          setSelectedGamingSession(null);
          handleSelectTab('inbox');
        }}
      />
    );
  }

  // 5. Squad Details
  if (selectedSquad) {
    return (
      <SquadDetailsScreen
        squad={selectedSquad}
        onBack={() => setSelectedSquad(null)}
        onOpenSquadChat={handleOpenSquadChat}
      />
    );
  }

  // 6. Community Details
  if (selectedCommunity) {
    return (
      <CommunityDetailsScreen
        community={selectedCommunity}
        onBack={() => setSelectedCommunity(null)}
        onExploreEvents={() => {
          setSelectedCommunity(null);
          handleSelectTab('explore');
        }}
      />
    );
  }

  // 7. Active Chat Detail
  if (activeConversation) {
    return (
      <ChatDetailScreen
        conversation={activeConversation}
        onBack={() => setActiveConversation(null)}
      />
    );
  }

  /* ------------------- MAIN TAB SHELL ------------------- */

  return (
    <View style={styles.container}>
      <View style={styles.screenContent}>
        {currentTab === 'home' && (
          <HomeScreen
            onEventPress={(evt) => setSelectedEvent(evt)}
            onGamingPress={(sess) => setSelectedGamingSession(sess)}
            onSquadPress={(sqd) => setSelectedSquad(sqd)}
            onCommunityPress={(comm) => setSelectedCommunity(comm)}
            onOpenCreate={() => setIsCreateChoiceOpen(true)}
            onOpenLocationModal={() => setIsLocationPickerOpen(true)}
            onOpenFilterModal={() => setIsFilterModalOpen(true)}
            onNavigateToExplore={handleNavigateToExplore}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreScreen
            initialCategory={exploreInitialCategory}
            onEventPress={(evt) => setSelectedEvent(evt)}
            onGamingPress={(sess) => setSelectedGamingSession(sess)}
            onSquadPress={(sqd) => setSelectedSquad(sqd)}
            onCommunityPress={(comm) => setSelectedCommunity(comm)}
            onOpenFilterModal={() => setIsFilterModalOpen(true)}
          />
        )}

        {currentTab === 'inbox' && (
          <InboxScreen
            onSelectConversation={(conv) => setActiveConversation(conv)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            onOpenHostDashboard={() => setIsHostDashboardOpen(true)}
            onEventPress={(evt) => setSelectedEvent(evt)}
            onLogoutPress={() => {
              logout();
              setAuthStep('welcome');
            }}
          />
        )}
      </View>

      {/* Global Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onCreatePress={() => setIsCreateChoiceOpen(true)}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* MODALS */}
      <CreateChoiceModal
        visible={isCreateChoiceOpen}
        onClose={() => setIsCreateChoiceOpen(false)}
        onSelectOption={handleSelectCreateOption}
      />

      <CreateEventModal
        visible={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreated={(evt) => setSelectedEvent(evt)}
      />

      <CreateGamingModal
        visible={isCreateGamingOpen}
        onClose={() => setIsCreateGamingOpen(false)}
        onCreated={() => setIsGamingHubOpen(true)}
      />

      <LocationPickerModal
        visible={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        selectedNeighborhood={selectedNeighborhood}
        onSelectNeighborhood={(area) => setSelectedNeighborhood(area)}
      />

      <FilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContent: {
    flex: 1,
  },
});
