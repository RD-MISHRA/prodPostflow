<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
    <div class="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center max-w-md w-full border border-gray-200">
      <div class="mb-6">
        <!-- Icon for Work in Progress (e.g., a gear or a construction cone) -->
        <svg class="w-20 h-20 text-blue-500 mx-auto animate-bounce-slow" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
      <h3 class="text-3xl font-extrabold text-gray-900 mb-4">Work In Progress</h3>
      <p class="text-lg text-gray-700 leading-relaxed mb-6">
        We're diligently working on bringing you an amazing feature! Please check back soon.
      </p>
      <div class="relative pt-1">
        <div class="flex mb-2 items-center justify-between">
          <div>
            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Building...
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold inline-block text-blue-600">
              75%
            </span>
          </div>
        </div>
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div style="width: 75%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 animate-progress-bar rounded"></div>
        </div>
      </div>
      <p class="text-sm text-gray-500 mt-4">
        Thank you for your patience!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkInProgress',
  
  data() {
    return {
      // If using props, you might not need local data for these.
    };
  },
  
};
</script>

<style scoped>

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite; /* Slower bounce */
}


@keyframes progress-bar-fill {
  0% { width: 0; }
  100% { width: var(--progress-width, 75%); } 
}

.animate-progress-bar {
  animation: progress-bar-fill 1.5s ease-out forwards;
}

</style>
