<template>
  <div class=" flex relative ">
   
    <button
      class="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow lg:hidden"
      @click="sidebarOpen = true"
      aria-label="Open Sidebar"
    >
     
      <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>

    
    <div
      class="fixed inset-y-0 left-0 w-64 h-screen bg-white text-gray-800 shadow-xl rounded-r-2xl p-6 z-40 flex flex-col transform transition-transform duration-300 ease-in-out
      lg:relative lg:translate-x-0 lg:rounded-none"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- X button inside sidebar for closing on mobile -->
      <button
        class="absolute top-4 right-4 p-2 text-gray-800 bg-gray-100 rounded-md shadow lg:hidden"
        @click="sidebarOpen = false"
        aria-label="Close Sidebar"
      >
        <!-- X icon -->
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
     <div class=" mt-12 md:block md:mt-0 ">
      <div class="flex items-center pb-6 mb-6 border-b border-gray-200 ">
        <h2 class="text-3xl font-extrabold text-blue-400 tracking-tight flex items-center">
          <img
            src="https://res.cloudinary.com/dbzwx9a7b/image/upload/v1750580149/Screenshot_2025-06-22_134532_cmnzyn.png"
            alt="PostFlow Logo"
            class="h-9 w-auto mr-3 drop-shadow-sm"
          />
          PostFlow
        </h2>
      </div>

      <nav class="flex-grow overflow-y-auto">
        <ul class="space-y-3">
          <li>
            <router-link
              to="/dashboard/create-post"
              class="flex items-center p-2 text-lg font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <img src="https://cdn-icons-png.flaticon.com/128/3161/3161837.png" class="w-6 h-6 mr-4" />
              Create Post
            </router-link>
          </li>

          <li>
            
             <router-link
              to="/dashboard/saved-post"
              class="flex items-center p-2 text-lg font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
               <font-awesome-icon :icon="['fas', 'bookmark']" class="mr-4 text-xl" /> Saved Posts
            </router-link>
          </li>

          <li>
            <a href="#" class="flex items-center p-2 text-lg font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition duration-300 ease-in-out transform hover:scale-105">
              <font-awesome-icon :icon="['fas', 'upload']" class="mr-4 text-xl" /> Published Posts
            </a>
          </li>

          <li>
            <a href="#" class="flex items-center p-2 text-lg font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition duration-300 ease-in-out transform hover:scale-105">
              <font-awesome-icon :icon="['fas', 'link']" class="mr-1 text-xl" /> Connect
              <img src="https://cdn-icons-png.flaticon.com/128/5968/5968830.png" alt="Connect Icon" class="w-6 h-6 ml-2">
              <img src="https://cdn-icons-png.flaticon.com/128/3536/3536505.png" alt="Connect Icon" class="w-6 h-6 ml-2">
              <img src="https://cdn-icons-png.flaticon.com/128/14463/14463575.png" alt="Connect Icon" class="w-6 h-6 ml-2">
            </a>
          </li>

          <li>
            <a href="#" class="flex items-center p-2 text-lg font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition duration-300 ease-in-out transform hover:scale-105">
              <font-awesome-icon :icon="['fas', 'clock']" class="mr-4 text-xl" /> Scheduled Posts
            </a>
          </li>

          <li>
            <a href="#" class="flex items-center p-2 text-lg font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition duration-300 ease-in-out transform hover:scale-105">
              <img src="https://cdn-icons-png.flaticon.com/128/747/747310.png" alt="Analytics Icon" class="w-6 h-6 mr-4">
              <font-awesome-icon :icon="['fas', 'calendar-alt']" class="mr-4 text-xl" /> Calendar
            </a>
          </li>
        </ul>
      </nav>

      </div>

      <div class="mt-auto pt-6 border-t border-gray-200">
        <a href="#" class="flex items-center p-2 rounded-lg hover:bg-blue-50 transition duration-300 ease-in-out">
          <img :src="user.photo" alt="User Avatar" class="w-12 h-12 rounded-full mr-4 border-2 border-blue-400 shadow-md">
          <div>
            <p class="font-extrabold text-xl text-gray-900">{{ user.name }}</p>
            <p class="text-sm text-blue-500">Admin</p>
          </div>
        </a>
      </div>
    </div>

    <!-- Main content area -->
    <main class="flex-1 overflow-auto min-h-screen">
      <router-view />
    </main>
  </div>
</template>

<script>
import {  mapGetters } from 'vuex';

export default {
  name: "DashBoard",
  data(){
    return {
      sidebarOpen:false,
    };
  },
  computed:{
    ...mapGetters(['user','isAutheticated'])
  
  }
};
</script>
