<template>
  <table class="table w-full border shadow">
    <thead v-if="folders.length">
      <tr>
        <th
          colspan="3"
          class="border-t border-base-500 select-none text-left px-4 py-1 flex gap-x-2"
        >
          <span v-for="(folder, index) in folders" :key="folder.id">
            <a
              class="text-sm mr-2"
              :class="
                index < folders.length - 1
                  ? 'hover:underline hover:text-blue-500 '
                  : 'cursor-default'
              "
              href="#"
              @click="
                (e) => {
                  e.preventDefault()
                  if (index < folders.length - 1) {
                    folders = folders.slice(0, index)
                    selectFolder(folder)
                  }
                  return false
                }
              "
            >
              {{ folder.name }}
            </a>
            <span v-if="index < folders.length - 1">/</span>
          </span>
        </th>
      </tr>
    </thead>
    <thead>
      <tr class="border-t text-left">
        <th class="px-4 py-1 border-base-500 select-none rounded-none">Name</th>
        <th class="px-4 py-1 border-base-500 select-none rounded-none">Modified</th>
        <th class="px-4 py-1 border-base-500 select-none rounded-none">Size</th>
      </tr>
    </thead>
    <tbody class="border-t border-base-500" v-if="loading">
      <tr>
        <td colspan="3" class="px-4 py-1">loading...</td>
      </tr>
    </tbody>
    <tbody class="border-t border-base-500" v-if="!loading">
      <tr v-if="folders.length > 1" class="row" @click="selectPrevious()">
        <td colspan="3">..</td>
      </tr>
      <tr v-for="file in results" :key="file.id" class="row" @click="selectFolder(file)">
        <td>
          {{ file.name }}
        </td>
        <td class="whitespace-nowrap">{{ date(file.updated_at || file.created_at) || '-' }}</td>
        <td>{{ size(file.size) || '' }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" class="border-t select-none px-4 py-1">
          Folders: {{ results.filter((f) => f.type === 'FOLDER').length }} - Files:
          {{ results.filter((f) => f.type === 'FILE').length }}
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import { type IStorageFile } from '../UnifiedStorage'

export default {
  props: {
    token: String,
    connection_id: String
  },
  data() {
    return {
      results: [] as IStorageFile[],
      folder_id: '',
      folders: [{ name: 'ROOT' }] as IStorageFile[],
      loading: false
    }
  },
  methods: {
    date(date?: any) {
      if (!date) {
        return ''
      }
      return new Date(date).toLocaleString('en-CA')
    },
    async selectPrevious() {
      this.folders.pop()
      this.folder_id = this.folders[this.folders.length - 1]?.id!
      await this.load()
    },
    async selectFolder(file: IStorageFile) {
      if (file.type === 'FILE' && file.download_url) {
        window.open(file.download_url, '_blank')
        return
      }

      this.folder_id = file.id!
      this.folders.push(file)
      await this.load()
    },
    async load() {
      this.loading = true
      this.results = []

      const url = `https://api.unified.to/storage/${this.connection_id}/file?parent_id=${this.folder_id || ''}`
      try {
        this.results = await (
          await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`
            }
          })
        ).json()
      } catch {
        this.results = []
      }

      this.loading = false
    },
    size(size?: number | string) {
      if (!size) {
        return ''
      }
      const _size = Number(size)
      if (_size < 1024) {
        return _size
      } else if (_size < 1024 * 1024) {
        return `${(_size / 1024).toFixed(1)}kb`
      } else if (_size < 1024 * 1024 * 1024) {
        return `${(_size / 1024 / 1024).toFixed(1)}mb`
      } else {
        return `${(_size / 1024 / 1024 / 1024).toFixed(1)}gb`
      }
    }
  },
  mounted() {
    this.load()
  }
}
</script>

<style scoped>
.table tr {
  @apply my-4;
}
.row {
  @apply cursor-pointer border-b border-gray-500;
}

.row td {
  @apply px-4 py-1;
}
.row:hover td {
  @apply bg-blue-500 text-white;
}
</style>
