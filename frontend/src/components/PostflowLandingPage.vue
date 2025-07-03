<template>
  <div class="md:mx-36 md:my-12">
    <div class="antialiased font-sans text-gray-800">

      <!-- Hero Section -->
      <header class="bg-white py-16 md:py-24 relative overflow-hidden">
        <div class="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between relative z-10">
          <!-- Text Content -->
          <div class="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 class="md:text-5xl font-extrabold leading-tight mb-6">
              Grow your Content <br>
              <span class="text-blue-500 underline decoration-wavy decoration-2 text-5xl">on Social Media</span>
            </h1>
            <p class="text-lg md:text-xl mb-10 max-w-lg mx-auto md:mx-0 text-black-400">
              Postflow.com is an all-in-one social media scheduling and management platform.
              It helps users create, schedule, and publish posts across LinkedIn, Instagram, Twitter, and Facebook with ease.
            </p>

            <div class="flex flex-col sm:flex-row items-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="https://github.com/RD-MISHRA/Postflow" target="_blank" rel="noopener noreferrer">
                <button class="bg-blue-500 text-black px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-3 hover:bg-blue-600 transition transform hover:scale-105 shadow-lg">
                  <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.385.6.113.793-.26.793-.577
                    0-.285-.01-1.04-.016-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729
                    1.204.085 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.304.762-1.604-2.665-.3-5.467-1.332-5.467-5.932
                    0-1.31.467-2.382 1.236-3.222-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.403c1.02.005
                    2.045.138 3.003.403 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.874.12 3.176.77.84 1.235 1.912 1.235 3.222
                    0 4.61-2.807 5.628-5.48 5.922.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.292 0 .32.19.694.8.576C20.565
                    21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>Rate us on GitHub</span>
                </button>
              </a>

              <button
                v-if="!isAuthenticated"
                @click="handleGoogleAuth"
                class="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-3 hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
              >
                <div class="flex-shrink-0 w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                </div>
                <span class="flex-grow text-left truncate">Continue with Google</span>
              </button>

              <router-link
                v-if="isAuthenticated"
                to="/dashboard/create-post"
                class="inline-block px-8 py-4 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-blue-600 transition transform hover:scale-105 shadow-lg text-center"
              >
                Dashboard
              </router-link>
            </div>

            <div class="flex items-center mt-6 text-gray-500 text-sm">
              <span class="mr-4">⭐ 4.7/5 on G2</span>
              <span>💳 No credit card required</span>
            </div>
          </div>

          <!-- Main Hero Image -->
          <div class="w-full md:w-1/2 relative flex justify-center md:justify-end items-center">
            <img src="https://i.postimg.cc/vTJXtmKZ/Chat-GPT-Image-Jun-28-2025-09-25-37-PM.png" class="rounded-lg w-full h-auto aspect-video object-cover">
          </div>
        </div>
      </header>

      <!-- Features Section -->
      <section class="space-y-8 md:space-y-24 mt-2 md:mt-0">
        <!-- Feature 1 -->
        <div class="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12">
          <div class="w-full md:w-1/2 order-2 md:order-1">
            <h2 class="text-2xl md:text-4xl font-bold mb-4">Create Posts for Multiple Platforms</h2>
            <p class="text-lg text-gray-600">Just write your content once, and we’ll help you create posts for LinkedIn, Twitter, Instagram, and more, simultaneously.</p>
          </div>
          <div class="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
            <img src="https://i.postimg.cc/qRJ9qQN0/Screenshot-2025-07-04-020402.png" class="rounded-xl shadow-lg w-full h-auto aspect-video object-cover">
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12">
          <div class="w-full md:w-1/2 flex justify-center">
            <img src="https://i.postimg.cc/QCPP630x/Screenshot-2025-07-04-020452.png" class="rounded-xl shadow-lg w-full h-auto aspect-video object-cover">
          </div>
          <div class="w-full md:w-1/2">
            <h2 class="text-2xl md:text-4xl font-bold mb-4">Rewrite, Edit, and Save</h2>
            <p class="text-lg text-gray-600">Make changes, improve your drafts, and save them as reusable templates for faster workflows.</p>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12">
          <div class="w-full md:w-1/2 order-2 md:order-1">
            <h2 class="text-2xl md:text-4xl font-bold mb-4">Connect Your Social Accounts</h2>
            <p class="text-lg text-gray-600">Link your LinkedIn, Twitter, and other social profiles securely to post directly from our platform.</p>
          </div>
          <div class="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
            <img src="https://i.postimg.cc/MT9gQRBB/Screenshot-2025-07-04-020541.png" class="rounded-xl shadow-lg w-full h-auto aspect-video object-cover">
          </div>
        </div>

        <!-- Feature 4 -->
        <div class="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12">
          <div class="w-full md:w-1/2 flex justify-center">
            <img src="https://i.postimg.cc/HWPfWwdD/Screenshot-2025-07-04-020525.png" class="rounded-xl shadow-lg w-full h-auto aspect-video object-cover">
          </div>
          <div class="w-full md:w-1/2">
            <h2 class="text-2xl md:text-4xl font-bold mb-4">Post Directly from Postflow</h2>
            <p class="text-lg text-gray-600">Publish your posts directly to your connected accounts, with one click.</p>
          </div>
        </div>

        <!-- Feature 5 -->
        <div class="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12">
          <div class="w-full md:w-1/2 order-2 md:order-1">
            <h2 class="text-2xl md:text-4xl font-bold mb-4">Calendar Tracking</h2>
            <p class="text-lg text-gray-600">Stay organized with a powerful calendar view that lets you plan and track all your upcoming posts easily.</p>
          </div>
          <div class="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
            <img src="https://i.postimg.cc/6qTgL3Vm/Screenshot-2025-07-04-020621.png" class="rounded-xl shadow-lg w-full h-auto aspect-video object-cover">
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
 
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    ...mapGetters(['user', 'isAuthenticated']),
  },
  watch: {
    '$route'() {
      this.isOpen = false;
    },
  },
  methods: {
    ...mapActions(['loginWithGoogle', 'logout']),
    
    handleGoogleAuth() {
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      console.log('↔️ Calculated left position:', left);
      const top = window.screen.height / 2 - height / 2;
      console.log('↕️ Calculated top position:', top);
      const backendUrl = process.env.VUE_APP_API_BASE_URL;
      console.log('🌐 Backend URL:', backendUrl);
      const googleAuthPopup = window.open(
        `${backendUrl}/api/auth/google`,
        'GoogleLogin',
        `width=${width},height=${height},top=${top},left=${left}`
      );
      console.log('🪟 Opened Google auth popup:', googleAuthPopup);
      const receiveMessage = async (event) => {
        console.log('📨 Received message event:', event);
        const { token, error } = event.data;
        console.log('📦 Message data:', { token, error });
        if (error) {
          console.log('❗ Error from popup:', error);
          alert(error);
          return;
        }
        if (token) {
          console.log('🔑 Token received:', token);
          try {
            localStorage.setItem('token', token);
            console.log('💾 Token saved to localStorage');
            await this.loginWithGoogle(token);
            console.log('✅ User authenticated and Vuex state updated');
            window.location.reload();
            console.log('🔄 Page reloaded');
          } catch (err) {
            console.error('❌ Failed to validate token:', err);
          }
        }
      };
      window.addEventListener('message', receiveMessage, false);
      console.log('🧏 Listening for message from popup');
      const timer = setInterval(() => {
        console.log('⏱ Checking if popup closed');
        if (googleAuthPopup.closed) {
          console.log('❌ Popup closed');
          clearInterval(timer);
          console.log('🛑 Interval cleared');
          window.removeEventListener('message', receiveMessage);
          console.log('🚫 Message listener removed');
        }
      }, 500);
    },
  },
};
</script>

<style scoped>
/* Optional custom styles */
</style>