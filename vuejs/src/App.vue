<template>
    <div class="">
      <div class="">
        <div class="px-6 pb-12 pt-12 lg:px-8 border-b border-gray-500">
          <h2 class="text-3xl font-bold tracking-tight text-white">
            <a class="link" href="https://unified.to" target="_blank">Unified.to</a> Messaging
            Demo
          </h2>
          <p class="normal-text">
            This sample code shows you how to interact with the
            <a class="link" href="https://docs.unified.to/messaging/overview" target="_blank">
              Unified.to Messaging API
            </a>
            and provides a messaging component that you can use in your own application.
          </p>
          <p class="normal-text">
            Because this is a demo, this VueJS browser application is calling the Unified.to API
            directly using your secret API token. This <b>MUST NEVER</b> happen as it will leak your
            secret API token. Always have your front-end call your API, which then calls the
            Unified.to API.
          </p>
        </div>
        <div class="px-6 pt-12 lg:px-8">
          <div v-if="connection_id">
            <MessagingComponent :connection_id="connection_id" :token="token" />
  
            <Button class="button mt-8" @click="reset_connection">Reset Connection</Button>
          </div>
          <div class="lg:mr-0 lg:max-w-lg" v-else-if="integrations === undefined">
            <div class="grid grid-cols-1 gap-x-8 gap-y-6">
              <div>
                <label for="workspace_id" class="form-label"> Workspace ID </label>
                <div class="mt-2.5">
                  <input type="text" id="workspace_id" v-model="workspace_id" class="form-input" />
                </div>
              </div>
              <div>
                <label for="token" class="form-label"> API Token </label>
                <div class="mt-2.5">
                  <input type="text" id="token" v-model="token" class="form-input" />
                </div>
              </div>
            </div>
            <div class="mt-8">
              <p class="normal-text">
                You can find these at
                <a class="link" target="_blank" href="https://app.unified.to/settings/api">
                  app.unified.to/settings/api
                </a>
              </p>
            </div>
            <div class="mt-8 flex justify-start">
              <button @click="set_info" :disabled="!workspace_id || !token" class="button">
                Continue
              </button>
            </div>
          </div>
  
          <div class="lg:mr-0 lg:max-w-lg" v-else-if="integrations.length === 0">
            <p class="normal-text">
              Please
              <a class="link" href="https://app.unified.to/integrations?tab=messaging" target="_blank">
                Activate Integrations
              </a>
              in the messaging category first
            </p>
          </div>
  
          <div v-else-if="!connection_id">
            <UnifiedDirectory :workspace_id="workspace_id" :categories="['messaging']" :environment="environment" />
            <Button class="button mt-8" @click="reset_auth">Reset Information</Button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { useAuthStore } from '@/stores/token'
  import UnifiedDirectory from '@unified-api/vuejs-directory'
  import MessagingComponent from '@/components/MessagingComponent.vue'
  
  export default {
    components: {
      UnifiedDirectory,
      MessagingComponent
    },
    setup() {
      const auth = useAuthStore()
      return {
        auth
      }
    },
    data() {
      return {
        integrations: undefined as undefined | any[],
        workspace_id: '',
        connection_id: '',
        token: '',
        environment: 'Sandbox'
      }
    },
    methods: {
      async get<T>(path: string) {
        const url = `https://api.unified.to/${path}`
        try {
          return (
            await fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
              }
            })
          ).json() as T
        } catch {
          return
        }
      },
  
      async set_info() {
        await this.auth.$patch({
          workspace_id: this.workspace_id,
          connection_id: this.connection_id,
          token: this.token
        })
  
        await this.get_integrations()
      },
      reset_auth() {
        this.integrations = undefined
      },
      reset_connection() {
        this.auth.connection_id = ''
        this.connection_id = ''
  
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.delete('id')
        window.location.search = urlParams.toString()
      },
  
      async get_integrations() {
        const user = await this.get<{ environment: string }>('unified/user')
  
        if (!user) {
          return
        }
        user.environment = user.environment || 'Sandbox'
        this.environment = user.environment;
  
        this.integrations = await this.get(
          `unified/integration/workspace/${this.workspace_id}?env=${encodeURIComponent(user.environment)}&categories=messaging`
        )
      }
    },
    mounted() {
      this.token = this.auth.token
      this.workspace_id = this.auth.workspace_id
      this.connection_id = this.auth.connection_id
  
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('id')) {
        this.auth.connection_id = this.connection_id = urlParams.get('id')!
      }
  
      if (!this.connection_id && this.workspace_id && this.token) {
        this.get_integrations()
      }
    }
  }
  </script>