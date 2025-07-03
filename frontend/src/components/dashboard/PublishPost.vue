<template>
  <div class="h-screen p-6 bg-white border rounded-2xl shadow-lg flex flex-col space-y-6 font-sans">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-6">Your Saved Posts</h2>

    <div v-if="loading" class="text-center text-gray-600">
      <p>Loading your saved posts...</p>
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mt-4"></div>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline ml-2">{{ error }}</span>
    </div>

    <div v-if="!loading && posts.length === 0 && !error" class="text-center text-gray-600 p-8 border border-dashed rounded-lg">
      <p class="text-lg mb-2">You haven't saved any posts yet.</p>
      <p class="text-sm">Generate and save posts to see them here!</p>
    </div>

    <div v-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="post in posts"
        :key="post._id"
        class="p-6 rounded-xl shadow-md border flex flex-col bg-gradient-to-br from-white to-gray-50"
      >
        <div class="flex items-center mb-3">
          <svg v-if="post.platform === 'Twitter'" class="w-6 h-6 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016.43 3c-2.5 0-4.52 2.24-4.52 5.02 0 .4.04.8.12 1.18A12.85 12.85 0 013 4.24a4.88 4.88 0 00-.61 2.53c0 1.74.87 3.28 2.19 4.18a4.43 4.43 0 01-2.05-.57v.06c0 2.43 1.6 4.46 3.74 4.92a4.47 4.47 0 01-2.04.08c.58 1.88 2.25 3.25 4.23 3.29A9 9 0 012 19.54 12.79 12.79 0 008.29 21c7.55 0 11.68-6.67 11.68-12.45 0-.19 0-.39-.01-.58A8.4 8.4 0 0023 3z" />
          </svg>
          <svg v-else-if="post.platform === 'LinkedIn'" class="w-6 h-6 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9.495h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.135.919-2.063 2.063-2.063 1.14 0 2.064.928 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9.495h3.564v10.957z" />
          </svg>
          <h3 class="text-lg font-bold" :class="post.platform === 'Twitter' ? 'text-blue-800' : 'text-indigo-800'">
            {{ post.platform }} Post
          </h3>
        </div>
        <p class="text-gray-800 font-semibold mb-2 line-clamp-1">{{ post.title }}</p>
        <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap flex-grow line-clamp-4">{{ post.content }}</p>
        <p class="text-gray-500 text-xs mt-2">Saved: {{ formatDate(post.generatedAt) }}</p>

        <button
          v-if="post.platform === 'Twitter'"
          @click="postToTwitter(post.content, post._id)"
          :disabled="postingStates[post._id]"
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-full shadow transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
        >
          <svg v-if="postingStates[post._id]" class="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>{{ postingStates[post._id] ? "Posting..." : "Post on X" }}</span>
        </button>

        <!-- Show tweet link nicely after posting -->
        <p v-if="tweetLinks[post._id]" class="text-blue-600 font-semibold mt-2 break-all">
          🔗 <a :href="tweetLinks[post._id]" target="_blank" class="underline">{{ tweetLinks[post._id] }}</a>
        </p>

        <button
          v-else-if="post.platform === 'LinkedIn'"
          @click="postToLinkedIn(post.content)"
          class="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-full shadow transition-colors duration-200 flex items-center justify-center"
        >
          Post on LinkedIn
        </button>
      </div>
    </div>

    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-xl animate-fade-in-out">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SavedPostWithPosting",
  data() {
    return {
      posts: [],
      loading: true,
      error: "",
      successMessage: "",
      tweetLinks: {},        // postId -> tweet link
      postingStates: {},     // postId -> true/false (loader)
    };
  },
  created() {
    this.fetchSavedPosts();
  },
  methods: {
    async fetchSavedPosts() {
      this.loading = true;
      this.error = "";
      const token = localStorage.getItem("token");
      if (!token) {
        this.error = "You are not logged in. Please log in to view saved posts.";
        this.loading = false;
        return;
      }

      const backendUrl = process.env.VUE_APP_API_BASE_URL;

      try {
        const res = await fetch(`${backendUrl}/api/user-posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `API error: ${res.status}`);
        }

        const data = await res.json();
        this.posts = data.posts;
      } catch (err) {
        console.error("Error fetching saved posts:", err);
        this.error = `Failed to load posts: ${err.message}.`;
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },

    async postToTwitter(content, postId) {
      const token = localStorage.getItem("token");
      const backendUrl = process.env.VUE_APP_API_BASE_URL;

      // Start loader for this post
      this.$set(this.postingStates, postId, true);

      try {
        const response = await fetch(`${backendUrl}/api/social/twitter/tweet`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: content }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Tweet failed");

        // Save tweet link nicely with x.com domain
        this.$set(this.tweetLinks, postId, `https://x.com/${data.username}/status/${data.tweetId}`);

        this.showSuccessMessage("Tweet posted on X!");
      } catch (err) {
        console.error("Error posting tweet:", err);
        this.error = `Failed to post: ${err.message}`;
      } finally {
        this.$set(this.postingStates, postId, false);
      }
    },

    async postToLinkedIn(content) {
      const token = localStorage.getItem("token");
      const backendUrl = process.env.VUE_APP_API_BASE_URL;

      try {
        const response = await fetch(`${backendUrl}/api/social/linkedin/post`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: content }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "LinkedIn post failed");

        this.showSuccessMessage("Post published on LinkedIn!");
      } catch (err) {
        console.error("Error posting LinkedIn:", err);
        this.error = `Failed to post: ${err.message}`;
      }
    },

    showSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = ""), 3000);
    },
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
