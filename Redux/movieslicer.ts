import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface FetchMoviesParams {
  // Pagination
  page?: number;
  
  // Date filters
  startDate?: string;
  endDate?: string;
  primaryReleaseYear?: number;
  releaseDateGte?: string;
  releaseDateLte?: string;
  
  // Rating filters
  voteAverageGte?: number;
  voteAverageLte?: number;
  voteCountGte?: number;
  voteCountLte?: number;
  
  // Content filters
  includeAdult?: boolean;
  includeVideo?: boolean;
  language?: string;
  region?: string;
  
  // Certification filters
  certification?: string;
  certificationGte?: string;
  certificationLte?: string;
  certificationCountry?: string;
  
  // Genre and content
  withGenres?: string;
  withoutGenres?: string;
  withKeywords?: string;
  withoutKeywords?: string;
  withCast?: string;
  withCrew?: string;
  withPeople?: string;
  withCompanies?: string;
  withoutCompanies?: string;
  
  // Runtime
  withRuntimeGte?: number;
  withRuntimeLte?: number;
  
  // Sorting
  sortBy?: string;
  
  // Origin
  withOriginCountry?: string;
  withOriginalLanguage?: string;
  
  // Watch providers
  watchRegion?: string;
  withWatchProviders?: string;
  withoutWatchProviders?: string;
  withWatchMonetizationTypes?: string;
  
  // Release type
  withReleaseType?: string;
  
  // Year filter
  year?: number;
}

// 1. Define the Async Thunk (The API Call)
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies', 
  async (params: FetchMoviesParams = {}) => {
    const {
      page = 1,
      startDate,
      endDate,
      primaryReleaseYear,
      releaseDateGte,
      releaseDateLte,
      voteAverageGte,
      voteAverageLte,
      voteCountGte,
      voteCountLte,
      includeAdult = false,
      includeVideo = false,
      language = 'en-US',
      region,
      certification,
      certificationGte,
      certificationLte,
      certificationCountry,
      withGenres,
      withoutGenres,
      withKeywords,
      withoutKeywords,
      withCast,
      withCrew,
      withPeople,
      withCompanies,
      withoutCompanies,
      withRuntimeGte,
      withRuntimeLte,
      sortBy = 'popularity.desc',
      withOriginCountry,
      withOriginalLanguage,
      watchRegion,
      withWatchProviders,
      withoutWatchProviders,
      withWatchMonetizationTypes,
      withReleaseType,
      year
    } = params;
    
    let url = `https://api.themoviedb.org/3/discover/movie?include_adult=${includeAdult}&include_video=${includeVideo}&language=${language}&page=${page}&sort_by=${sortBy}`;
    
    // Date filters
    if (startDate) url += `&primary_release_date.gte=${startDate}`;
    if (endDate) url += `&primary_release_date.lte=${endDate}`;
    if (primaryReleaseYear) url += `&primary_release_year=${primaryReleaseYear}`;
    if (releaseDateGte) url += `&release_date.gte=${releaseDateGte}`;
    if (releaseDateLte) url += `&release_date.lte=${releaseDateLte}`;
    if (year) url += `&year=${year}`;
    
    // Rating filters
    if (voteAverageGte !== undefined) url += `&vote_average.gte=${voteAverageGte}`;
    if (voteAverageLte !== undefined) url += `&vote_average.lte=${voteAverageLte}`;
    if (voteCountGte !== undefined) url += `&vote_count.gte=${voteCountGte}`;
    if (voteCountLte !== undefined) url += `&vote_count.lte=${voteCountLte}`;
    
    // Region and certification
    if (region) url += `&region=${region}`;
    if (certification) url += `&certification=${certification}`;
    if (certificationGte) url += `&certification.gte=${certificationGte}`;
    if (certificationLte) url += `&certification.lte=${certificationLte}`;
    if (certificationCountry) url += `&certification_country=${certificationCountry}`;
    
    // Content filters
    if (withGenres) url += `&with_genres=${withGenres}`;
    if (withoutGenres) url += `&without_genres=${withoutGenres}`;
    if (withKeywords) url += `&with_keywords=${withKeywords}`;
    if (withoutKeywords) url += `&without_keywords=${withoutKeywords}`;
    if (withCast) url += `&with_cast=${withCast}`;
    if (withCrew) url += `&with_crew=${withCrew}`;
    if (withPeople) url += `&with_people=${withPeople}`;
    if (withCompanies) url += `&with_companies=${withCompanies}`;
    if (withoutCompanies) url += `&without_companies=${withoutCompanies}`;
    
    // Runtime
    if (withRuntimeGte !== undefined) url += `&with_runtime.gte=${withRuntimeGte}`;
    if (withRuntimeLte !== undefined) url += `&with_runtime.lte=${withRuntimeLte}`;
    
    // Origin
    if (withOriginCountry) url += `&with_origin_country=${withOriginCountry}`;
    if (withOriginalLanguage) url += `&with_original_language=${withOriginalLanguage}`;
    
    // Watch providers
    if (watchRegion) url += `&watch_region=${watchRegion}`;
    if (withWatchProviders) url += `&with_watch_providers=${withWatchProviders}`;
    if (withoutWatchProviders) url += `&without_watch_providers=${withoutWatchProviders}`;
    if (withWatchMonetizationTypes) url += `&with_watch_monetization_types=${withWatchMonetizationTypes}`;
    
    // Release type
    if (withReleaseType) url += `&with_release_type=${withReleaseType}`;
    
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTBhZGJmNWZiNjA1Zjk0MzljZTJkMTMyZDRjOWM4OSIsIm5iZiI6MTc2Mzg2OTE5Ni44MTc5OTk4LCJzdWIiOiI2OTIyODIwYzQ4MjhkMzM5N2QwYmEzZWEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-jK1F_g9PFcQ8L5skh-CdPKkB2kEJGR3df_sfS5Ov9Y'
      }
    };

    const response = await fetch(url, options);
    const data = await response.json();
    return {
      movies: data.results,
      currentPage: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results
    };
  }
);

// Fetch Movie Details by ID
export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (movieId: string) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTBhZGJmNWZiNjA1Zjk0MzljZTJkMTMyZDRjOWM4OSIsIm5iZiI6MTc2Mzg2OTE5Ni44MTc5OTk4LCJzdWIiOiI2OTIyODIwYzQ4MjhkMzM5N2QwYmEzZWEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-jK1F_g9PFcQ8L5skh-CdPKkB2kEJGR3df_sfS5Ov9Y'
      }
    };

    const response = await fetch(url, options);
    const data = await response.json();
    
    // Return the movie data directly
    return data;
  }
);

// 2. Create the Slice
const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    list: [] as any[],
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    movieDetail: null as any,
    detailStatus: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    detailError: null as string | null,
    favorites: [] as number[],
    filters: {
      // Date filters
      startDate: null as string | null,
      endDate: null as string | null,
      primaryReleaseYear: null as number | null,
      year: null as number | null,
      
      // Rating filters
      voteAverageGte: null as number | null,
      voteAverageLte: null as number | null,
      voteCountGte: null as number | null,
      
      // Content filters
      withGenres: null as string | null,
      withoutGenres: null as string | null,
      sortBy: 'popularity.desc' as string,
      
      // Runtime filters
      withRuntimeGte: null as number | null,
      withRuntimeLte: null as number | null,
      
      // Region and language
      region: null as string | null,
      language: 'en-US' as string,
      
      // Adult content
      includeAdult: false as boolean,
    },
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
  },
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.status = 'idle'; // Trigger refetch
    },
    clearFilters: (state) => {
      state.filters = {
        startDate: null,
        endDate: null,
        primaryReleaseYear: null,
        year: null,
        voteAverageGte: null,
        voteAverageLte: null,
        voteCountGte: null,
        withGenres: null,
        withoutGenres: null,
        sortBy: 'popularity.desc',
        withRuntimeGte: null,
        withRuntimeLte: null,
        region: null,
        language: 'en-US',
        includeAdult: false,
      };
      state.status = 'idle'; // Trigger refetch
    },
    toggleFavorite: (state, action) => {
      const movieId = action.payload;
      const index = state.favorites.indexOf(movieId);
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(movieId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Loading State
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
      })
      // Handle Success State
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.movies;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalResults = action.payload.totalResults;
      })
      // Handle Error State
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      // Handle Movie Details Loading State
      .addCase(fetchMovieDetails.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
      })
      // Handle Movie Details Success State
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.movieDetail = action.payload;
      })
      // Handle Movie Details Error State
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.error.message ?? null;
      });
  },
});

export const { updateFilters, clearFilters, toggleFavorite } = movieSlice.actions;
export default movieSlice.reducer;