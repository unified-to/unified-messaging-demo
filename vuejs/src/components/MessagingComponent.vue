<template>
    <div>
      <h3 class="text-xl font-bold mb-4">Channels and Messages</h3>
      
      <div v-if="channels.length > 0">
        <label for="channel-select" class="block mb-2">Select a channel:</label>
        <select id="channel-select" v-model="selectedChannelId" class="form-input mb-4">
          <option v-for="channel in channels" :key="channel.id" :value="channel.id">
            {{ channel.name }}
          </option>
        </select>
      </div>
  
      <div v-if="selectedChannelId">
        <h4 class="text-lg font-semibold mb-2">Messages:</h4>
        <ul class="space-y-2">
          <li v-for="message in messages" :key="message.id" class="border p-2 rounded">
            <strong>{{ message.author_member?.name || 'Unknown' }}:</strong> {{ message.message }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    props: {
      connection_id: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        channels: [],
        selectedChannelId: '',
        messages: []
      }
    },
    watch: {
      selectedChannelId() {
        this.fetchMessages()
      }
    },
    methods: {
      async fetchChannels() {
        const url = `https://api.unified.to/messaging/${this.connection_id}/channel`
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`
            }
          })
          this.channels = await response.json()
        } catch (error) {
          console.error('Error fetching channels:', error)
        }
      },
      async fetchMessages() {
        if (!this.selectedChannelId) return
        
        const url = `https://api.unified.to/messaging/${this.connection_id}/message?channel_id=${this.selectedChannelId}`
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`
            }
          })
          this.messages = await response.json()
        } catch (error) {
          console.error('Error fetching messages:', error)
        }
      }
    },
    mounted() {
      this.fetchChannels()
    }
  }
  </script>