export interface QuickAnswer {
   [key: string]: any
   id: string
   name: string
   text: string
   color: string
   position: number
}

export interface UserConfig {
   id: string
   autoMessage?: {
      enabled: boolean
      text: string
   }
   hello?: string
   signature?: string
   quickAnswers?: QuickAnswer[]
}

export interface MeliQuestionData {
   date_created: Date
   item_id: string
   seller_id: number
   status: string
   text: string
   id: number
   deleted_from_listing: boolean
   hold: boolean
   answer?: {
      text: string
      status: string
      date_created: Date
   }
   from: {
      id: number
      nickname: string
      city: string | null
   }
   item: MeliItem
   previous: {
      total: number
      limit: number
      offset: number
      results: PreviousQuestion[]
   }
}

export interface PreviousQuestion {
   text: string
   answer: {
      date_created: Date
      text: string
   }
   date_created: Date
   status: string
}

export interface MeliItem {
   id: string
   title: string
   price: number
   available_quantity: number
   permalink: string
   secure_thumbnail: string
   status: string
   shipping: {
      mode: string
      methods: string[]
      tags: string[]
      dimensions: unknown
      local_pick_up: boolean
      free_shipping: boolean
      logistic_type: string
      store_pick_up: boolean
   }
   condition: {
      id: string
      name: string
      value_id: string
      value_name: string
      value_struct: unknown
      values: [
         {
            id: string
            name: string
            struct: unknown
         }
      ]
      attribute_group_id: string
      attribute_group_name: string
   }
   SKU: {
      id: string
      name: string
      value_id: string
      value_name: string
      value_struct: unknown
      values: [
         {
            id: string
            name: string
            struct: unknown
         }
      ]
      attribute_group_id: string
      attribute_group_name: string
   }
}

export interface MeliApiError {
   message: string
   error: string
   status: number
   cause: string[]
}

export interface MeliNotification {
   resource: string
   user_id: number
   topic: string
   application_id: number
   attemps: number
   sent: Date
   received: Date
}

export interface MeliQuestionsResponse {
   total: number
   limit: number
   offset: number
   next: string
   results: MeliQuestionData[]
}

export interface MeliUserData {
   id: number
   nickname: string
   registration_date: Date
   country_id: string
   address: { city: string; state: string }
   user_type: string
   tags: string[]
   logo: any
   points: number
   site_id: string
   permalink: string
   seller_reputation: {
      level_id: any
      power_seller_status: any
      transactions: {
         canceled: number
         completed: number
         period: string
         ratings: object[]
         total: number
      }
   }
   buyer_reputation: { tags: string[] }
   status: { site_status: string }
}

export interface Paging {
   total: number
   offset: number
   limit: number
   next?: string
}

export interface ApiOrdersResponse {
   results: Order[]
   paging: Paging
}

export interface Order {
   id: string
   cartId?: number
   meliOrderIds: number[]
   buyer: MeliBuyer
   items: {
      id: string
      price: number
      quantity: number
      secure_thumbnail: string
      condition: string
      title: string
      permalink: string
   }[]
   shippingId?: number
   invoiceStatus: InvoiceStatus
   invoiceId?: string | number
   searchStatus: SearchStatus
   saleChannel: SaleChannel
   createdAt: Date
   updatedAt: Date
}

export enum InvoiceStatus {
   Pending = 'pending',
   Emitted = 'emitted',
   Canceled = 'canceled'
}

export enum SearchStatus {
   Pending = 'pending',
   NotFound = 'not_found',
   Found = 'found',
   Delivered = 'delivered'
}

export enum SaleChannel {
   ML = 'mercadolibre',
   MS = 'mercadoshops',
   LOCAL = 'local',
   SHOP = 'shop'
}

export interface MeliBuyer {
   id: number
   nickname: string
   email?: string
   first_name?: string
   last_name?: string
   registration_date?: Date
   country_id?: string
}
