<template>
  <div class="max-w-md mx-auto p-6 bg-white border rounded-2xl shadow-lg flex flex-col space-y-4">
    <h2 class="text-xl font-bold text-gray-800">Post a Tweet</h2>

    <textarea
      v-model="tweetText"
      placeholder="Write your tweet here..."
      class="w-full border rounded-lg p-3 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      rows="4"
    ></textarea>

    <button
      @click="postTweet"
      :disabled="loading || tweetText.trim() === ''"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      <svg v-if="loading" class="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span>{{ loading ? "Posting..." : "Post Tweet" }}</span>
    </button>

    <p v-if="successMessage" class="text-green-600 font-semibold">{{ successMessage }}</p>
    <p v-if="tweetLink" class="text-blue-600 font-semibold">
      🔗 <a :href="tweetLink" target="_blank" class="underline">View Tweet</a>
    </p>
    <p v-if="errorMessage" class="text-red-600 font-semibold">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: "PostTweet",
  data() {
    return {
      tweetText: "",
      loading: false,
      successMessage: "",
      errorMessage: "",
      tweetLink: "", // NEW: store tweet URL
    };
  },
  methods: {
    async postTweet() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.errorMessage = "You need to login first!";
        return;
      }

      this.loading = true;
      this.successMessage = "";
      this.errorMessage = "";
      this.tweetLink = "";

      try {
        const response = await fetch("http://localhost:5000/api/social/twitter/tweet", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: this.tweetText }),
        });

        const data = await response.json();
        if (response.ok) {
          this.successMessage = `✅ Tweet posted!`;
          this.tweetText = "";

          // build tweet URL
          this.tweetLink = `https://twitter.com/${data.username}/status/${data.tweetId}`;
        } else {
          this.errorMessage = data.error || "Tweet failed";
        }
      } catch (error) {
        console.error("❌ Error posting tweet:", error);
        this.errorMessage = "Network or server error";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Optional: style improvements could go here */
</style>
