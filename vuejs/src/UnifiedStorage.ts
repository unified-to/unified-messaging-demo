/*
UnifiedStorage
==============
File storage
*/
export const FileType = ['FILE', 'FOLDER'] as const

export type TFileType = (typeof FileType)[number]

export const PermissionRole = ['OWNER', 'READ', 'WRITE'] as const

export type TPermissionRole = (typeof PermissionRole)[number]

export interface IStorageFile {
  id?: string
  created_at?: string | Date
  updated_at?: string | Date
  name: string
  description?: string
  parent_id?: string
  user_id?: string
  size?: number
  type: TFileType
  mime_type?: string
  permissions?: IStoragePermission[]
  download_url?: string
  hash?: string
  raw?: unknown
}

export interface IStoragePermission {
  user_id?: string
  group_id?: string
  roles: TPermissionRole[]
}
