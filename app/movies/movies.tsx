import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearFilters, fetchMovies, toggleFavorite, updateFilters } from '../../Redux/movieslicer';
import { logout } from '../../Redux/authSlice';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  createdAt: string;
  avatar?: string;
  role: string;
}

interface RootState {
  movies: {
    list: Movie[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
    favorites: number[];
    filters: {
      startDate: string | null;
      endDate: string | null;
      primaryReleaseYear: number | null;
      year: number | null;
      voteAverageGte: number | null;
      voteAverageLte: number | null;
      voteCountGte: number | null;
      withGenres: string | null;
      withoutGenres: string | null;
      sortBy: string;
      withRuntimeGte: number | null;
      withRuntimeLte: number | null;
      region: string | null;
      language: string;
      includeAdult: boolean;
    };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  auth: {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
}

export default function Movies() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: movies, currentPage, totalPages, totalResults, favorites, filters, status, error } = useSelector((state: RootState) => state.movies);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            router.replace('/');
          },
        },
      ]
    );
  };
  
  const [showFilters, setShowFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [startDate, setStartDate] = useState(filters.startDate || '');
  const [endDate, setEndDate] = useState(filters.endDate || '');
  const [primaryReleaseYear, setPrimaryReleaseYear] = useState(filters.primaryReleaseYear?.toString() || '');
  const [voteAverageGte, setVoteAverageGte] = useState(filters.voteAverageGte?.toString() || '');
  const [voteAverageLte, setVoteAverageLte] = useState(filters.voteAverageLte?.toString() || '');
  const [voteCountGte, setVoteCountGte] = useState(filters.voteCountGte?.toString() || '');
  const [withGenres, setWithGenres] = useState(filters.withGenres || '');
  const [sortBy, setSortBy] = useState(filters.sortBy || 'popularity.desc');
  const [withRuntimeGte, setWithRuntimeGte] = useState(filters.withRuntimeGte?.toString() || '');
  const [withRuntimeLte, setWithRuntimeLte] = useState(filters.withRuntimeLte?.toString() || '');
  const [includeAdult, setIncludeAdult] = useState(filters.includeAdult);

  // Helper functions for date handling
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateForAPI = (year: number, month: number, day: number) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  const generateMonths = () => {
    return [
      { value: 1, label: 'January' },
      { value: 2, label: 'February' },
      { value: 3, label: 'March' },
      { value: 4, label: 'April' },
      { value: 5, label: 'May' },
      { value: 6, label: 'June' },
      { value: 7, label: 'July' },
      { value: 8, label: 'August' },
      { value: 9, label: 'September' },
      { value: 10, label: 'October' },
      { value: 11, label: 'November' },
      { value: 12, label: 'December' },
    ];
  };

  const generateDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies({
        page: 1,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        primaryReleaseYear: filters.primaryReleaseYear || undefined,
        voteAverageGte: filters.voteAverageGte || undefined,
        voteAverageLte: filters.voteAverageLte || undefined,
        voteCountGte: filters.voteCountGte || undefined,
        withGenres: filters.withGenres || undefined,
        sortBy: filters.sortBy,
        withRuntimeGte: filters.withRuntimeGte || undefined,
        withRuntimeLte: filters.withRuntimeLte || undefined,
        includeAdult: filters.includeAdult,
      }) as any);
    }
  }, [status, dispatch, filters]);

  const handleRefresh = () => {
    dispatch(fetchMovies({
      page: currentPage,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      primaryReleaseYear: filters.primaryReleaseYear || undefined,
      voteAverageGte: filters.voteAverageGte || undefined,
      voteAverageLte: filters.voteAverageLte || undefined,
      voteCountGte: filters.voteCountGte || undefined,
      withGenres: filters.withGenres || undefined,
      sortBy: filters.sortBy,
      withRuntimeGte: filters.withRuntimeGte || undefined,
      withRuntimeLte: filters.withRuntimeLte || undefined,
      includeAdult: filters.includeAdult,
    }) as any);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(fetchMovies({
      page: newPage,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      primaryReleaseYear: filters.primaryReleaseYear || undefined,
      voteAverageGte: filters.voteAverageGte || undefined,
      voteAverageLte: filters.voteAverageLte || undefined,
      voteCountGte: filters.voteCountGte || undefined,
      withGenres: filters.withGenres || undefined,
      sortBy: filters.sortBy,
      withRuntimeGte: filters.withRuntimeGte || undefined,
      withRuntimeLte: filters.withRuntimeLte || undefined,
      includeAdult: filters.includeAdult,
    }) as any);
  };

  const applyFilters = () => {
    // Validate date range
    if (startDate && endDate && startDate > endDate) {
      Alert.alert('Invalid Date Range', 'Start date cannot be later than end date');
      return;
    }

    // Validate numeric fields
    if (voteAverageGte && (isNaN(Number(voteAverageGte)) || Number(voteAverageGte) < 0 || Number(voteAverageGte) > 10)) {
      Alert.alert('Invalid Rating', 'Minimum rating must be between 0 and 10');
      return;
    }
    
    if (voteAverageLte && (isNaN(Number(voteAverageLte)) || Number(voteAverageLte) < 0 || Number(voteAverageLte) > 10)) {
      Alert.alert('Invalid Rating', 'Maximum rating must be between 0 and 10');
      return;
    }

    dispatch(updateFilters({ 
      startDate: startDate || null, 
      endDate: endDate || null,
      primaryReleaseYear: primaryReleaseYear ? Number(primaryReleaseYear) : null,
      voteAverageGte: voteAverageGte ? Number(voteAverageGte) : null,
      voteAverageLte: voteAverageLte ? Number(voteAverageLte) : null,
      voteCountGte: voteCountGte ? Number(voteCountGte) : null,
      withGenres: withGenres || null,
      sortBy,
      withRuntimeGte: withRuntimeGte ? Number(withRuntimeGte) : null,
      withRuntimeLte: withRuntimeLte ? Number(withRuntimeLte) : null,
      includeAdult,
    }));
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setPrimaryReleaseYear('');
    setVoteAverageGte('');
    setVoteAverageLte('');
    setVoteCountGte('');
    setWithGenres('');
    setSortBy('popularity.desc');
    setWithRuntimeGte('');
    setWithRuntimeLte('');
    setIncludeAdult(false);
    dispatch(clearFilters());
    setShowFilters(false);
  };

  const renderMovieCard = ({ item: movie }: { item: Movie }) => {
    const imageUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null;
    
    const isFavorite = favorites.includes(movie.id);
    
    const handleMoviePress = () => {
      router.push({
        pathname: '/movies/[id]',
        params: { id: movie.id.toString() }
      });
    };

    const handleFavoritePress = (event: any) => {
      event.stopPropagation(); // Prevent movie card press
      dispatch(toggleFavorite(movie.id));
    };
    
    return (
      <TouchableOpacity style={styles.movieCard} onPress={handleMoviePress}>
        <View style={styles.cardContent}>
          <View style={styles.posterContainer}>
            {imageUrl ? (
              <Image 
                source={{ uri: imageUrl }}
                style={styles.posterImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons name="movie" size={60} color="#ccc" />
              </View>
            )}
            
            {/* Favorite Button */}
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleFavoritePress}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name={isFavorite ? "favorite" : "favorite-border"} 
                size={24} 
                color={isFavorite ? "#ff4757" : "#fff"} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {movie.title}
            </Text>
            
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{movie.vote_average?.toFixed(1) || 'N/A'}</Text>
            </View>
            
            <Text style={styles.releaseDate}>
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
            </Text>
            
            <Text style={styles.movieOverview} numberOfLines={3}>
              {movie.overview || 'No overview available'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="movie" size={60} color="#007AFF" />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error" size={60} color="#ff4444" />
        <Text style={styles.errorText}>Oops! Something went wrong</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <MaterialIcons name="refresh" size={20} color="#fff" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* User Profile Section */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <View style={styles.userIconContainer}>
              <MaterialIcons name="account-circle" size={40} color="#007AFF" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{currentUser?.fullName || 'Guest User'}</Text>
              <Text style={styles.userRole}>{currentUser?.role || 'Viewer'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#ff4757" />
          </TouchableOpacity>
        </View>

        {/* Main Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Trending Movies</Text>
            <Text style={styles.subtitle}>
              {totalResults.toLocaleString()} movies available
              {(filters.startDate || filters.endDate || filters.primaryReleaseYear || filters.voteAverageGte || filters.withGenres) && ' (filtered)'}
            </Text>
          </View>
          <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              showFavoritesOnly && styles.activeFilter
            ]} 
            onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <MaterialIcons name="favorite" size={20} color="#fff" />
            {favorites.length > 0 && (
              <View style={styles.favoritesBadge}>
                <Text style={styles.favoritesBadgeText}>{favorites.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              (filters.startDate || filters.endDate || filters.primaryReleaseYear || filters.voteAverageGte || filters.withGenres) ? styles.activeFilter : null
            ]} 
            onPress={() => setShowFilters(!showFilters)}
          >
            <MaterialIcons name="filter-list" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <MaterialIcons name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Comprehensive Filters */}
      {showFilters && (
        <ScrollView style={styles.filtersContainer} showsVerticalScrollIndicator={false}>
          {/* Date & Year Section */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>📅 Date & Year</Text>
            <View style={styles.filterGrid}>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Start Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <MaterialIcons name="calendar-today" size={16} color="#666" />
                  <Text style={styles.datePickerText}>
                    {formatDateForDisplay(startDate)}
                  </Text>
                </TouchableOpacity>
                {startDate && (
                  <TouchableOpacity 
                    style={styles.clearDateButton}
                    onPress={() => setStartDate('')}
                  >
                    <MaterialIcons name="clear" size={14} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>End Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <MaterialIcons name="calendar-today" size={16} color="#666" />
                  <Text style={styles.datePickerText}>
                    {formatDateForDisplay(endDate)}
                  </Text>
                </TouchableOpacity>
                {endDate && (
                  <TouchableOpacity 
                    style={styles.clearDateButton}
                    onPress={() => setEndDate('')}
                  >
                    <MaterialIcons name="clear" size={14} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Release Year</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowYearPicker(true)}
                >
                  <MaterialIcons name="event" size={16} color="#666" />
                  <Text style={styles.datePickerText}>
                    {primaryReleaseYear || 'Select Year'}
                  </Text>
                </TouchableOpacity>
                {primaryReleaseYear && (
                  <TouchableOpacity 
                    style={styles.clearDateButton}
                    onPress={() => setPrimaryReleaseYear('')}
                  >
                    <MaterialIcons name="clear" size={14} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Rating Section */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>⭐ Rating & Popularity</Text>
            <View style={styles.filterGrid}>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Min Rating</Text>
                <TextInput
                  style={styles.filterInput}
                  value={voteAverageGte}
                  onChangeText={setVoteAverageGte}
                  placeholder="7.0"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Max Rating</Text>
                <TextInput
                  style={styles.filterInput}
                  value={voteAverageLte}
                  onChangeText={setVoteAverageLte}
                  placeholder="10.0"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Min Vote Count</Text>
                <TextInput
                  style={styles.filterInput}
                  value={voteCountGte}
                  onChangeText={setVoteCountGte}
                  placeholder="1000"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Genre Section */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>🎭 Genres</Text>
            <View style={styles.genreContainer}>
              <Text style={styles.genreHint}>Popular Genre IDs: Action (28), Comedy (35), Drama (18), Horror (27), Romance (10749), Sci-Fi (878)</Text>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Include Genres (comma separated)</Text>
                <TextInput
                  style={[styles.filterInput, styles.genreInput]}
                  value={withGenres}
                  onChangeText={setWithGenres}
                  placeholder="28,12,878" 
                  placeholderTextColor="#999"
                  multiline={true}
                />
              </View>
            </View>
          </View>

          {/* Runtime Section */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>⏱️ Runtime (minutes)</Text>
            <View style={styles.filterGrid}>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Min Runtime</Text>
                <TextInput
                  style={styles.filterInput}
                  value={withRuntimeGte}
                  onChangeText={setWithRuntimeGte}
                  placeholder="90"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Max Runtime</Text>
                <TextInput
                  style={styles.filterInput}
                  value={withRuntimeLte}
                  onChangeText={setWithRuntimeLte}
                  placeholder="180"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Sorting & Content Section */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>📊 Sorting & Content</Text>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.sortContainer}>
                <TouchableOpacity 
                  style={[styles.sortOption, sortBy === 'popularity.desc' && styles.activeSortOption]}
                  onPress={() => setSortBy('popularity.desc')}
                >
                  <Text style={[styles.sortOptionText, sortBy === 'popularity.desc' && styles.activeSortText]}>Popular</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sortOption, sortBy === 'release_date.desc' && styles.activeSortOption]}
                  onPress={() => setSortBy('release_date.desc')}
                >
                  <Text style={[styles.sortOptionText, sortBy === 'release_date.desc' && styles.activeSortText]}>Latest</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sortOption, sortBy === 'vote_average.desc' && styles.activeSortOption]}
                  onPress={() => setSortBy('vote_average.desc')}
                >
                  <Text style={[styles.sortOptionText, sortBy === 'vote_average.desc' && styles.activeSortText]}>Top Rated</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Include Adult Content</Text>
              <Switch
                value={includeAdult}
                onValueChange={setIncludeAdult}
                trackColor={{ false: '#e1e5e9', true: '#007AFF' }}
                thumbColor={includeAdult ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
              <MaterialIcons name="clear" size={18} color="#fff" />
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <MaterialIcons name="check" size={18} color="#fff" />
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Movies List */}
      <FlatList
        data={showFavoritesOnly ? movies.filter(movie => favorites.includes(movie.id)) : movies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          showFavoritesOnly ? (
            <View style={styles.emptyFavoritesContainer}>
              <MaterialIcons name="favorite-border" size={60} color="#ccc" />
              <Text style={styles.emptyFavoritesText}>No favorite movies yet</Text>
              <Text style={styles.emptyFavoritesSubtext}>Tap the heart icon on any movie to add it to your favorites</Text>
            </View>
          ) : null
        }
      />

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <MaterialIcons name="chevron-left" size={20} color={currentPage === 1 ? "#ccc" : "#007AFF"} />
        </TouchableOpacity>
        
        <View style={styles.pageInfo}>
          <Text style={styles.pageText}>Page {currentPage} of {totalPages}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <MaterialIcons name="chevron-right" size={20} color={currentPage === totalPages ? "#ccc" : "#007AFF"} />
        </TouchableOpacity>
      </View>

      {/* Start Date Picker Modal */}
      <DatePickerModal
        visible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        onDateSelect={(date) => {
          setStartDate(date);
          setShowStartDatePicker(false);
        }}
        title="Select Start Date"
        currentDate={startDate}
      />

      {/* End Date Picker Modal */}
      <DatePickerModal
        visible={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        onDateSelect={(date) => {
          setEndDate(date);
          setShowEndDatePicker(false);
        }}
        title="Select End Date"
        currentDate={endDate}
      />

      {/* Year Picker Modal */}
      <YearPickerModal
        visible={showYearPicker}
        onClose={() => setShowYearPicker(false)}
        onYearSelect={(year) => {
          setPrimaryReleaseYear(year.toString());
          setShowYearPicker(false);
        }}
        title="Select Release Year"
        currentYear={primaryReleaseYear ? parseInt(primaryReleaseYear) : null}
      />
    </View>
  );
}

// Date Picker Modal Component
interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  title: string;
  currentDate: string;
}

const DatePickerModal = ({ visible, onClose, onDateSelect, title, currentDate }: DatePickerModalProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  useEffect(() => {
    if (currentDate) {
      const date = new Date(currentDate);
      setSelectedYear(date.getFullYear());
      setSelectedMonth(date.getMonth() + 1);
      setSelectedDay(date.getDate());
    } else {
      const now = new Date();
      setSelectedYear(now.getFullYear());
      setSelectedMonth(now.getMonth() + 1);
      setSelectedDay(now.getDate());
    }
  }, [currentDate, visible]);

  const years = [];
  for (let year = new Date().getFullYear(); year >= 1900; year--) {
    years.push(year);
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const days = [];
  for (let day = 1; day <= getDaysInMonth(selectedYear, selectedMonth); day++) {
    days.push(day);
  }

  const handleConfirm = () => {
    const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    onDateSelect(formattedDate);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.datePickerContainer}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Year</Text>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerOption,
                      selectedYear === year && styles.selectedPickerOption
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedYear === year && styles.selectedPickerOptionText
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Month</Text>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.pickerOption,
                      selectedMonth === index + 1 && styles.selectedPickerOption
                    ]}
                    onPress={() => setSelectedMonth(index + 1)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedMonth === index + 1 && styles.selectedPickerOptionText
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Day</Text>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.pickerOption,
                      selectedDay === day && styles.selectedPickerOption
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedDay === day && styles.selectedPickerOptionText
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirm}>
              <Text style={styles.modalConfirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Year Picker Modal Component
interface YearPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onYearSelect: (year: number) => void;
  title: string;
  currentYear: number | null;
}

const YearPickerModal = ({ visible, onClose, onYearSelect, title, currentYear }: YearPickerModalProps) => {
  const [selectedYear, setSelectedYear] = useState(currentYear || new Date().getFullYear());

  const years = [];
  for (let year = new Date().getFullYear(); year >= 1900; year--) {
    years.push(year);
  }

  const handleConfirm = () => {
    onYearSelect(selectedYear);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.yearPickerContainer}>
            <ScrollView style={styles.yearPicker} showsVerticalScrollIndicator={false}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearOption,
                    selectedYear === year && styles.selectedYearOption
                  ]}
                  onPress={() => setSelectedYear(year)}
                >
                  <Text style={[
                    styles.yearOptionText,
                    selectedYear === year && styles.selectedYearOptionText
                  ]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirm}>
              <Text style={styles.modalConfirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  userSection: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconContainer: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#FF6B35',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
  },
  filtersContainer: {
    maxHeight: 2000,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterItem: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f8f9fa',
  },
  genreContainer: {
    gap: 8,
  },
  genreHint: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  genreInput: {
    minHeight: 40,
    textAlignVertical: 'top',
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    backgroundColor: '#f8f9fa',
  },
  activeSortOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeSortText: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  filterActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#f8f9fa',
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  applyButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  movieCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  posterContainer: {
    position: 'relative',
    width: 80,
    height: 120,
  },
  posterImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  releaseDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  movieOverview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  pageButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageInfo: {
    marginHorizontal: 20,
  },
  pageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  // Date Picker Styles
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    gap: 8,
  },
  datePickerText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  clearDateButton: {
    position: 'absolute',
    right: 8,
    top: 28,
    padding: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  datePickerContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  picker: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 6,
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  selectedPickerOption: {
    backgroundColor: '#007AFF',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedPickerOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  yearPickerContainer: {
    marginBottom: 20,
  },
  yearPicker: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 6,
  },
  yearOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  selectedYearOption: {
    backgroundColor: '#007AFF',
  },
  yearOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedYearOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  // Favorites Styles
  favoritesBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  favoritesBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyFavoritesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyFavoritesSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});