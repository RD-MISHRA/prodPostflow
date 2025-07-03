<template>
  <div class="max-w-3xl mx-auto h-screen  p-6 bg-white  rounded-2xl  flex flex-col space-y-6 font-sans">
    <h2 class="text-3xl font-extrabold text-center text-neon">
  What would you like to post today?
</h2>

    <div class="flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300 ease-in-out">
      <input
        v-model="prompt"
        type="text"
        class="flex-grow outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
        placeholder="Tell me about your post idea (e.g., 'new AI features for content creation')..."
        @keyup.enter="generatePosts"
      />
      <button
        :disabled="loading || !prompt.trim()"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-5 py-2 ml-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg"
        @click="generatePosts"
      >
        {{ loading ? 'Generating...' : 'Generate Posts' }}
      </button>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline ml-2">{{ error }}</span>
    </div>

    <div v-if="twitterPost || linkedinPost" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-if="twitterPost" class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 flex flex-col">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-6.597-8.717L5.337 22H1.723l7.228-8.26L1.723 2.25H5.337l5.7 7.929L18.244 2.25zM17.292 20l-1.157-2.956L2.924 4h2.817l5.965 15.463L17.292 20z" />
          </svg>
          <h3 class="text-xl font-bold text-blue-800">Twitter Post</h3>
        </div>
        <p class="text-gray-800 leading-relaxed whitespace-pre-wrap flex-grow">{{ twitterPost }}</p>
        <div class="flex justify-between mt-4 space-x-2">
          <button
            @click="copyToClipboard(twitterPost, 'Twitter')"
            class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200 ease-in-out flex-grow"
          >
            Copy
          </button>
          <button
            @click="savePost(twitterPost, 'Twitter')"
            :disabled="savingTwitter"
            class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200 ease-in-out flex-grow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ savingTwitter ? 'Saving...' : 'Save Post' }}
          </button>
        </div>
      </div>

      <div v-if="linkedinPost" class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-lg border border-indigo-200 flex flex-col">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-indigo-500 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9.495h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.135.919-2.063 2.063-2.063 1.14 0 2.064.928 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9.495h3.564v10.957zM22.229 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.458c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.208 0 22.229 0z" />
          </svg>
          <h3 class="text-xl font-bold text-indigo-800">LinkedIn Post</h3>
        </div>
        <p class="text-gray-800 leading-relaxed whitespace-pre-wrap flex-grow">{{ linkedinPost }}</p>
        <div class="flex justify-between mt-4 space-x-2">
          <button
            @click="copyToClipboard(linkedinPost, 'LinkedIn')"
            class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200 ease-in-out flex-grow"
          >
            Copy
          </button>
          <button
            @click="savePost(linkedinPost, 'LinkedIn')"
            :disabled="savingLinkedIn"
            class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200 ease-in-out flex-grow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ savingLinkedIn ? 'Saving...' : 'Save Post' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-xl animate-fade-in-out">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreatePost',
  data() {
    return {
      prompt: '',
      twitterPost: '',
      linkedinPost: '',
      error: '',
      loading: false,
      savingTwitter: false, // New loading state for saving Twitter post
      savingLinkedIn: false, // New loading state for saving LinkedIn post
      successMessage: '', // Combined success message for copy and save
    };
  },
  methods: {
    async generatePosts() {
      if (!this.prompt.trim()) {
        this.error = 'Please enter a post idea.';
        return;
      }

      this.loading = true;
      this.twitterPost = '';
      this.linkedinPost = '';
      this.error = '';
      this.successMessage = ''; // Clear previous messages

      const backendUrl = process.env.VUE_APP_API_BASE_URL || ''; 

      try {
        const res = await fetch(`${backendUrl}/api/generate-post`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: this.prompt }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `API error: ${res.status}`);
        }
        const data = await res.json();

        this.twitterPost = data.twitterPost || 'No Twitter post generated.';
        this.linkedinPost = data.linkedinPost || 'No LinkedIn post generated.';

      } catch (err) {
        console.error("Frontend error:", err);
        this.error = `Something went wrong: ${err.message}. Please try again.`;
      } finally {
        this.loading = false;
      }
    },

    // New method to save a post
    async savePost(content, platform) {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        this.error = 'You must be logged in to save posts.';
        this.showSuccessMessage('Please log in to save posts.', 'error'); // Use success message area for error feedback
        return;
      }

      // Set platform-specific saving state
      if (platform === 'Twitter') {
        this.savingTwitter = true;
      } else if (platform === 'LinkedIn') {
        this.savingLinkedIn = true;
      }
      this.error = ''; // Clear general error

      // Generate title from the first 4 words of the content
      const title = content.split(' ').slice(0, 4).join(' ');
      if (!title.trim()) {
          this.error = 'Post content too short to generate a title.';
          this.showSuccessMessage('Post content too short to generate a title.', 'error');
          this.savingTwitter = false;
          this.savingLinkedIn = false;
          return;
      }

      const backendUrl = process.env.VUE_APP_API_BASE_URL || ''; 
   
      try {
        const res = await fetch(`${backendUrl}/api/save-post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Send the token
          },
          body: JSON.stringify({ content, title, platform }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          // Check for specific error messages from backend
          if (res.status === 401 || res.status === 403) {
            throw new Error(`Authentication failed: ${errorData.message || 'Invalid token.'}`);
          }
          throw new Error(errorData.message || `API error: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Save successful:", data);
        this.showSuccessMessage(`Post for ${platform} saved successfully!`);

      } catch (err) {
        console.error("Error saving post:", err);
        this.error = `Failed to save post: ${err.message}.`;
        this.showSuccessMessage(`Failed to save post: ${err.message}.`, 'error'); // Display error in success message area
      } finally {
        this.savingTwitter = false;
        this.savingLinkedIn = false;
      }
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

    // Helper to display messages in the success/error banner
    showSuccessMessage(message, type = 'success') {
      this.successMessage = message;
      // You can add different styling based on 'type' if you expand the CSS
      if (type === 'error') {
        // Optionally, make it red or add an error class to the successMessage div
        // For now, just setting the message.
      }
      setTimeout(() => {
        this.successMessage = '';
      }, 3000); // Message disappears after 3 seconds
    }
  },
};
</script>

<style scoped>
/* Tailwind CSS is assumed to be available */
/* Custom styles for animations if needed beyond Tailwind */
@keyframes fade-in-out {
  0% { opacity: 0; transform: translateY(20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(20px); }
}

.animate-fade-in-out {
  animation: fade-in-out 3s forwards; /* Increased duration for messages */
}

input::placeholder {
  color: #9ca3af; /* Tailwind gray-400 */
}
</style>