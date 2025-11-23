import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails } from '../../Redux/movieslicer';

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genres: Array<{ id: number; name: string }>;
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  vote_count: number;
  runtime: number;
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
  production_companies: Array<{ id: number; name: string; logo_path?: string }>;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  spoken_languages: Array<{ english_name: string; iso_639_1: string; name: string }>;
}

interface RootState {
  movies: {
    movieDetail: MovieDetail | null;
    detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    detailError: string | null;
  };
}

export default function MovieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { movieDetail, detailStatus, detailError } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(id) as any);
    }
  }, [id, dispatch]);

  const handleGoBack = () => {
    router.back();
  };

  const formatReleaseDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (detailStatus === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="movie" size={60} color="#007AFF" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (detailStatus === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error" size={60} color="#ff4444" />
        <Text style={styles.errorText}>Failed to load movie details</Text>
        <Text style={styles.errorSubtext}>{detailError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => id && dispatch(fetchMovieDetails(id) as any)}>
          <MaterialIcons name="refresh" size={20} color="#fff" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!movieDetail) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="movie" size={60} color="#ccc" />
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  const backdropUrl = movieDetail.backdrop_path 
    ? `https://image.tmdb.org/t/p/w780${movieDetail.backdrop_path}`
    : null;
    
  const posterUrl = movieDetail.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
    : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Backdrop Image */}
      {backdropUrl && (
        <View style={styles.backdropContainer}>
          <Image 
            source={{ uri: backdropUrl }}
            style={styles.backdropImage}
            resizeMode="cover"
          />
          <View style={styles.backdropOverlay} />
        </View>
      )}

      {/* Movie Info Section */}
      <View style={styles.movieInfoSection}>
        <View style={styles.posterAndDetails}>
          {/* Poster */}
          <View style={styles.posterContainer}>
            {posterUrl ? (
              <Image 
                source={{ uri: posterUrl }}
                style={styles.posterImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderPoster}>
                <MaterialIcons name="movie" size={80} color="#ccc" />
              </View>
            )}
          </View>

          {/* Basic Details */}
          <View style={styles.basicDetails}>
            <Text style={styles.movieTitle}>{movieDetail.title}</Text>
            
            {movieDetail.original_title !== movieDetail.title && (
              <Text style={styles.originalTitle}>({movieDetail.original_title})</Text>
            )}

            <View style={styles.metaInfo}>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={18} color="#FFD700" />
                <Text style={styles.ratingText}>{movieDetail.vote_average.toFixed(1)}</Text>
                <Text style={styles.voteCount}>({movieDetail.vote_count} votes)</Text>
              </View>

              <Text style={styles.releaseDate}>
                {formatReleaseDate(movieDetail.release_date)}
              </Text>

              <Text style={styles.language}>
                Language: {movieDetail.original_language.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Genres */}
        {movieDetail.genres && movieDetail.genres.length > 0 && (
          <View style={styles.genresSection}>
            <Text style={styles.sectionTitle}>Genres</Text>
            <View style={styles.genresContainer}>
              {movieDetail.genres.map((genre) => (
                <View key={genre.id} style={styles.genreChip}>
                  <Text style={styles.genreText}>
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Overview */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overviewText}>
            {movieDetail.overview || 'No overview available for this movie.'}
          </Text>
        </View>

        {/* Tagline */}
        {movieDetail.tagline && (
          <View style={styles.taglineSection}>
            <Text style={styles.tagline}>"{movieDetail.tagline}"</Text>
          </View>
        )}

        {/* Additional Info */}
        <View style={styles.additionalInfoSection}>
          <Text style={styles.sectionTitle}>Movie Details</Text>
          
          <View style={styles.infoGrid}>
            {movieDetail.runtime && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Runtime</Text>
                <Text style={styles.infoValue}>{movieDetail.runtime} min</Text>
              </View>
            )}
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{movieDetail.status || 'Unknown'}</Text>
            </View>
            
            {movieDetail.budget > 0 && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Budget</Text>
                <Text style={styles.infoValue}>${(movieDetail.budget / 1000000).toFixed(1)}M</Text>
              </View>
            )}

            {movieDetail.revenue > 0 && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Revenue</Text>
                <Text style={styles.infoValue}>${(movieDetail.revenue / 1000000).toFixed(1)}M</Text>
              </View>
            )}

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Popularity</Text>
              <Text style={styles.infoValue}>{movieDetail.popularity.toFixed(1)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Adult Content</Text>
              <Text style={styles.infoValue}>{movieDetail.adult ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        </View>

        {/* Production Companies */}
        {movieDetail.production_companies && movieDetail.production_companies.length > 0 && (
          <View style={styles.productionSection}>
            <Text style={styles.sectionTitle}>Production Companies</Text>
            <View style={styles.productionContainer}>
              {movieDetail.production_companies.slice(0, 5).map((company) => (
                <Text key={company.id} style={styles.productionCompany}>
                  {company.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {movieDetail.spoken_languages && movieDetail.spoken_languages.length > 0 && (
          <View style={styles.languagesSection}>
            <Text style={styles.sectionTitle}>Spoken Languages</Text>
            <View style={styles.languagesContainer}>
              {movieDetail.spoken_languages.map((language, index) => (
                <View key={language.iso_639_1} style={styles.languageChip}>
                  <Text style={styles.languageText}>
                    {language.english_name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

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
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 20,
  },
  backdropContainer: {
    height: 250,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  movieInfoSection: {
    backgroundColor: '#fff',
    marginTop: -40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flex: 1,
  },
  posterAndDetails: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  posterContainer: {
    marginRight: 16,
    marginTop: -60,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  placeholderPoster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  basicDetails: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    lineHeight: 30,
  },
  originalTitle: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  metaInfo: {
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  voteCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  releaseDate: {
    fontSize: 14,
    color: '#666',
  },
  language: {
    fontSize: 14,
    color: '#666',
  },
  genresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  overviewSection: {
    marginBottom: 24,
  },
  overviewText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  additionalInfoSection: {
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    minWidth: '45%',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  taglineSection: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  productionSection: {
    marginBottom: 24,
  },
  productionContainer: {
    gap: 8,
  },
  productionCompany: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  languagesSection: {
    marginBottom: 24,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageChip: {
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  languageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});