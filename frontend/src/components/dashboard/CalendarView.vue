<template>
  <div class="max-w-6xl mx-auto h-screen p-6 bg-white border rounded-2xl shadow-lg flex flex-col space-y-6 font-sans">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-6">Your Post Calendar</h2>

    <div v-if="loading" class="text-center text-gray-600">
      <p>Loading your saved posts for the calendar...</p>
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mt-4"></div>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline ml-2">{{ error }}</span>
    </div>

    <div v-if="!loading && !error" class="flex flex-col">
      <!-- Main Calendar View - now takes full width -->
      <div class="w-full flex flex-col space-y-4">
        <!-- Calendar Header/Navigation -->
        <div class="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm">
          <div class="flex space-x-2 mb-2 sm:mb-0">
            <button @click="$refs.calendar.move({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 })" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">Today</button>
            <button @click="$refs.calendar.moveBy(-1)" class="px-3 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200">&lt;</button>
            <button @click="$refs.calendar.moveBy(1)" class="px-3 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200">&gt;</button>
          </div>
          <h3 class="text-xl font-bold text-gray-800 text-center sm:text-left mb-2 sm:mb-0">{{ currentMonthYear }}</h3>
          <div class="flex space-x-2">
            <input type="text" placeholder="Search posts..." v-model="searchTerm" @input="filterPosts" class="px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>

        <!-- V-Calendar component -->
        <v-calendar
          ref="calendar"
          :attributes="attributes"
          is-expanded
          class="w-full max-w-full calendar-custom-style"
          @update:from-page="updateMonthYear"
        >
          <!-- Custom content for date cells to show post titles -->
          <template v-slot:day-content="{ day, attributes }">
            <div class="flex flex-col h-full z-10 overflow-hidden p-1">
              <span class="text-xs font-semibold text-gray-700">{{ day.day }}</span>
              <div class="flex flex-col mt-1 space-y-0.5 overflow-y-auto custom-scrollbar flex-grow">
                <template v-for="attr in attributes">
                  <div
                    v-if="attr.customData && attr.customData.posts && attr.customData.posts.length > 0"
                    :key="attr.key"
                    class="text-xs px-1 py-0.5 rounded-md truncate cursor-pointer"
                    :class="[
                      attr.customData.posts[0].platform === 'Twitter' ? 'bg-blue-100 text-green-800' : 'bg-indigo-100 text-indigo-800'
                    ]"
                    :title="attr.customData.posts.map(p => p.title).join('\n')"
                    @click="showPostDetails(attr.customData.posts)"
                  >
                    <!-- Display first post title, or a count if multiple -->
                    {{ attr.customData.posts.length > 1 ? `${attr.customData.posts.length} posts` : attr.customData.posts[0].title }}
                  </div>
                </template>
              </div>
            </div>
          </template>
        </v-calendar>
      </div>
    </div>

    <!-- Post Details Modal (Simple) -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <h3 class="text-2xl font-bold mb-4 text-gray-800">Post Details</h3>
        <button @click="showModal = false" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
        <div class="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          <div v-for="post in selectedPosts" :key="post._id" class="border border-gray-200 rounded-md p-3"
            :class="[
              post.platform === 'Twitter' ? 'bg-blue-50' : 'bg-indigo-50'
            ]">
            <p class="font-semibold text-md mb-1">{{ post.title }}</p>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ post.content }}</p>
            <p class="text-xs text-gray-500 mt-2">Platform: {{ post.platform }} | Saved: {{ formatDate(post.generatedAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message for Copy -->
    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-xl animate-fade-in-out">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>


export default {
  name: 'CalendarView',
  
  data() {
    return {
      allPosts: [], 
      posts: [], 
      attributes: [], 
      loading: true,
      error: '',
      successMessage: '',
      searchTerm: '',
      currentMonthYear: '', 
      showModal: false,
      selectedPosts: [],
    };
  },
  created() {
    this.fetchSavedPosts();
  },
  methods: {
    async fetchSavedPosts() {
      this.loading = true;
      this.error = '';
      const token = localStorage.getItem('token'); // Get token from local storage

      if (!token) {
        this.error = 'You are not logged in. Please log in to view saved posts.';
        this.loading = false;
        return;
      }

      const backendUrl = process.env.VUE_APP_API_BASE_URL || ''; 

      try {
        const res = await fetch(`${backendUrl}/api/user-posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Send the token
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 401 || res.status === 403) {
            throw new Error(`Authentication failed: ${errorData.message || 'Invalid token.'}`);
          }
          throw new Error(errorData.message || `API error: ${res.status}`);
        }

        const data = await res.json();
        this.allPosts = data.posts; // Store all posts
        this.posts = data.posts; // Initialize displayed posts
        console.log("Fetched saved posts for calendar:", this.allPosts);
        this.processPostsForCalendar();

      } catch (err) {
        console.error("Error fetching saved posts for calendar:", err);
        this.error = `Failed to load posts for calendar: ${err.message}.`;
      } finally {
        this.loading = false;
      }
    },

    processPostsForCalendar() {
      const attributesMap = new Map();

      // Filter posts based on searchTerm before processing for calendar
      const filteredPosts = this.allPosts.filter(post =>
        post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      filteredPosts.forEach(post => {
        const date = new Date(post.generatedAt);
        const dateKey = date.toISOString().split('T')[0]; 

        if (!attributesMap.has(dateKey)) {
          attributesMap.set(dateKey, {
            key: dateKey,
            dates: date,
            dot: true,
            popover: {
              visibility: 'hover',
              label: '',
            },
            customData: {
              posts: [],
            },
          });
        }

        const attr = attributesMap.get(dateKey);
        attr.customData.posts.push(post);
        attr.popover.label = attr.customData.posts.map(p => p.title).join('\n');
      });

      this.attributes = Array.from(attributesMap.values());
      console.log("Calendar attributes:", this.attributes);
    },

    filterPosts() {
      // Re-process posts for calendar whenever search term changes
      this.processPostsForCalendar();
    },

    updateMonthYear({ month, year }) {
      const date = new Date(year, month - 1); // month is 1-indexed in v-calendar
      this.currentMonthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    },

    formatDate(dateString, includeTime = false) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }
      return new Date(dateString).toLocaleDateString(undefined, options);
    },

    showPostDetails(posts) {
      this.selectedPosts = posts;
      this.showModal = true;
    },

    showSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  },
  mounted() {
    // Set initial month/year display
    this.updateMonthYear(this.$refs.calendar.pages[0]);
  }
};
</script>
