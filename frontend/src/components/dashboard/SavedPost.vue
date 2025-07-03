<template>
  <div class="h-screen border-4  p-6 bg-white border rounded-2xl shadow-lg flex flex-col space-y-6 font-sans">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-6">Your Saved Posts</h2>

    <div v-if="loading" class="text-center text-gray-600">
      <p>Loading your saved posts...</p>
      <!-- Optional: Add a simple spinner -->
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mt-4"></div>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline ml-2">{{ error }}</span>
    </div>

    <div v-if="!loading && posts.length === 0 && !error" class="text-center text-gray-600 p-8 border border-dashed rounded-lg">
      <p class="text-lg mb-2">You haven't saved any posts yet.</p>
      <p class="text-sm">Generate some posts and click 'Save Post' to see them here!</p>
    </div>

    <div v-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="post in posts"
        :key="post._id"
        :class="[
          'p-6 rounded-xl shadow-md border flex flex-col',
          post.platform === 'Twitter' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200'
        ]"
      >
        <div class="flex items-center mb-3">
          <svg v-if="post.platform === 'Twitter'" class="w-6 h-6 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-6.597-8.717L5.337 22H1.723l7.228-8.26L1.723 2.25H5.337l5.7 7.929L18.244 2.25zM17.292 20l-1.157-2.956L2.924 4h2.817l5.965 15.463L17.292 20z" />
          </svg>
          <svg v-else-if="post.platform === 'LinkedIn'" class="w-6 h-6 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9.495h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.135.919-2.063 2.063-2.063 1.14 0 2.064.928 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9.495h3.564v10.957zM22.229 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.458c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.208 0 22.229 0z" />
          </svg>
          <h3 class="text-lg font-bold" :class="post.platform === 'Twitter' ? 'text-blue-800' : 'text-indigo-800'">
            {{ post.platform }} Post
          </h3>
        </div>
        <p class="text-gray-800 font-semibold mb-2 line-clamp-1">{{ post.title }}</p>
        <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap flex-grow line-clamp-4">{{ post.content }}</p>
        <p class="text-gray-500 text-xs mt-2">Saved: {{ formatDate(post.generatedAt) }}</p>
        <button
          @click="copyToClipboard(post.content, post.platform)"
          class="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 ease-in-out"
        >
          Copy Post
        </button>
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
  name: 'SavedPost',
  data() {
    return {
      posts: [],
      loading: true,
      error: '',
      successMessage: '',
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

      const backendUrl = process.env.VUE_APP_API_BASE_URL;

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
          // Handle specific auth errors
          if (res.status === 401 || res.status === 403) {
            throw new Error(`Authentication failed: ${errorData.message || 'Invalid token.'}`);
          }
          throw new Error(errorData.message || `API error: ${res.status}`);
        }

        const data = await res.json();
        this.posts = data.posts;
        console.log("Fetched saved posts:", this.posts);

      } catch (err) {
        console.error("Error fetching saved posts:", err);
        this.error = `Failed to load posts: ${err.message}.`;
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    copyToClipboard(text, platform) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        this.showSuccessMessage(`${platform} post copied!`);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        this.error = 'Failed to copy text. Please try manually.';
      } finally {
        document.body.removeChild(textarea);
      }
    },
    showSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = '';
      }, 3000); // Message disappears after 3 seconds
    }
  },
};
</script>

<style scoped>

@keyframes fade-in-out {
  0% { opacity: 0; transform: translateY(20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(20px); }
}

.animate-fade-in-out {
  animation: fade-in-out 3s forwards;
}


</style>
