<template>
  <div class="flex flex-col items-center justify-center space-y-4 p-6 border rounded-2xl shadow-lg bg-white w-full max-w-sm mx-auto">
    <div class="text-xl font-bold text-gray-800">Connect your X (Twitter) account</div>

    <div v-if="loading" class="text-gray-500">Checking connection status...</div>

    <div v-if="!loading && connected" class="text-green-600 font-semibold">
      ✅ Connected as @{{ account.username }}
      <div class="text-sm text-gray-500">Connected at: {{ new Date(account.connectedAt).toLocaleString() }}</div>
    </div>

    <button
      @click="connectTwitter"
      class="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow transition duration-300"
      :disabled="loading"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.84 1.09A4.52 4.52 0 0 0 16.18 0c-2.61 0-4.68 2.28-4.12 4.81A12.94 12.94 0 0 1 3 1.7a4.48 4.48 0 0 0-.64 2.27 4.52 4.52 0 0 0 2 3.76A4.49 4.49 0 0 1 2 6.6v.06a4.52 4.52 0 0 0 3.6 4.44A4.52 4.52 0 0 1 4 11a4.52 4.52 0 0 0 4.2 3.12A9.05 9.05 0 0 1 1 18.54 12.75 12.75 0 0 0 7.29 20c8.39 0 12.98-7.34 12.72-13.93A9.18 9.18 0 0 0 23 3z"/>
      </svg>
      <span>Connect Twitter</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "ConnectSocial",
  data() {
    return {
      connected: false,
      account: null,
      loading: true,
    };
  },
  mounted() {
    this.checkConnection();
  },
  methods: {
    async checkConnection() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to login first!");
        this.loading = false;
        return;
      }

      const backendUrl = process.env.VUE_APP_API_BASE_URL; 

      try {
        const response = await fetch(`${backendUrl}/api/social/twitter`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.connected) {
          this.connected = true;
          this.account = data.account;
        } else {
          this.connected = false;
        }
      } catch (error) {
        console.error("❌ Error checking connection:", error);
        alert("Failed to check Twitter connection");
      } finally {
        this.loading = false;
      }
    },
    connectTwitter() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to login first!");
        return;
      }

      const backendUrl = process.env.VUE_APP_API_BASE_URL; 

      window.location.href = `${backendUrl}/auth/x?token=${token}`;
    },
  },
};
</script>

<style scoped>
/* Optional: customize styles */
</style>
