<template>
    <div class="modal" v-if="show">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2>Edit Event</h2>
      <p>This is a simple edit modal for test</p>
      <p>{{ eventId }}</p>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, defineEmits, watch } from 'vue';

  const show = ref(false); // control visibility
  const eventId = ref(''); // Event ID
  const emit = defineEmits(['close']);

  // Function to close the modal
  const close = () => {
    emit('close');
  };

  // this wont work
  watch(show, (newValue, oldValue) => {
    console.log('watching')
    console.log('show changed:', newValue);
  });
  
  </script>
  
  <style scoped>
  /* Add your modal styling here */
  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  </style>