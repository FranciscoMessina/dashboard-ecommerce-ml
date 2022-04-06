declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      accessToken: string
    }
  }

  interface User {
    id: string
    accessToken: string
  }
}

export interface QuickAnswer {
  [key: string]: any
  _id: string
  name: string
  text: string
  color: string
}

export interface UserConfig {
  uuid: string
  saleMsg?: {
    enabled: boolean
    text: string
  }
  preAnswerMsg?: string
  postAnswerMsg?: string
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
  answer: {
    text: string
    status: string
    date_created: Date
  } | null
  from: {
    id: number
    nickname: string
    city: string | null
  }
  item: MeliItem
  previous: PreviousQuestion[]
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
  thumbnail: string
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

export interface FullMeliItem {
  id: string
  site_id: string
  title: string
  subtitle: unknown
  seller_id: number
  category_id: string
  official_store_id: unknown
  price: number
  base_price: number
  original_price: number
  inventory_id: unknown
  currency_id: string
  initial_quantity: number
  available_quantity: number
  sold_quantity: number
  sale_terms: [
    {
      id: 'WARRANTY_TIME'
      name: 'Tiempo de garantía'
      value_id: unknown
      value_name: '30 días'
      value_struct: {
        number: 30
        unit: 'días'
      }
      values: [
        {
          id: unknown
          name: '30 días'
          struct: {
            number: 30
            unit: 'días'
          }
        }
      ]
    },
    {
      id: 'WARRANTY_TYPE'
      name: 'Tipo de garantía'
      value_id: '2230280'
      value_name: 'Garantía del vendedor'
      value_struct: unknown
      values: [
        {
          id: '2230280'
          name: 'Garantía del vendedor'
          struct: unknown
        }
      ]
    }
  ]
  buying_mode: 'buy_it_now'
  listing_type_id: 'gold_special'
  start_time: '2021-09-13T00:38:30.000Z'
  stop_time: '2041-09-07T04:00:00.000Z'
  end_time: '2041-09-07T04:00:00.000Z'
  expiration_time: '2022-06-07T22:01:28.000Z'
  condition: 'new'
  permalink: 'https://articulo.mercadolibre.com.ar/MLA-1103025489-item-de-test-no-ofertar-_JM'
  thumbnail_id: '687365-MLA47465960920_092021'
  thumbnail: 'http://http2.mlstatic.com/D_687365-MLA47465960920_092021-I.jpg'
  secure_thumbnail: 'https://http2.mlstatic.com/D_687365-MLA47465960920_092021-I.jpg'
  pictures: [
    {
      id: '687365-MLA47465960920_092021'
      url: 'http://http2.mlstatic.com/D_687365-MLA47465960920_092021-O.jpg'
      secure_url: 'https://http2.mlstatic.com/D_687365-MLA47465960920_092021-O.jpg'
      size: '500x438'
      max_size: '548x481'
      quality: ''
    }
  ]
  video_id: unknown
  descriptions: []
  accepts_mercadopago: boolean
  non_mercado_pago_payment_methods: []
  shipping: {
    mode: 'not_specified'
    methods: []
    tags: []
    dimensions: unknown
    local_pick_up: boolean
    free_shipping: boolean
    logistic_type: 'not_specified'
    store_pick_up: boolean
  }
  international_delivery_mode: 'none'
  seller_address: {
    address_line: 'Acassuso 215'
    zip_code: '1642'
    city: {
      id: 'TUxBQ1NBTjg4ZmJk'
      name: 'San Isidro'
    }
    state: {
      id: 'AR-B'
      name: 'Buenos Aires'
    }
    country: {
      id: 'AR'
      name: 'Argentina'
    }
    search_location: {
      city: {
        id: 'TUxBQ1NBTjg4ZmJk'
        name: 'San Isidro'
      }
      state: {
        id: 'TUxBUEdSQWU4ZDkz'
        name: 'Bs.As. G.B.A. Norte'
      }
    }
    latitude: -34.4706622
    longitude: -58.51073559999999
    id: 1195126405
  }
  seller_contact: unknown
  location: {}
  geolocation: {
    latitude: -34.4706622
    longitude: -58.51073559999999
  }
  coverage_areas: []
  attributes: [
    {
      id: 'ITEM_CONDITION'
      name: 'Condición del ítem'
      value_id: '2230284'
      value_name: 'Nuevo'
      value_struct: unknown
      values: [
        {
          id: '2230284'
          name: 'Nuevo'
          struct: unknown
        }
      ]
      attribute_group_id: ''
      attribute_group_name: ''
    },
    {
      id: 'BRAND'
      name: 'Marca'
      value_id: unknown
      value_name: 'Marca del producto'
      value_struct: unknown
      values: [
        {
          id: unknown
          name: 'Marca del producto'
          struct: unknown
        }
      ]
      attribute_group_id: 'OTHERS'
      attribute_group_name: 'Otros'
    },
    {
      id: 'GTIN'
      name: 'Código universal de producto'
      value_id: unknown
      value_name: '7898095297749'
      value_struct: unknown
      values: [
        {
          id: unknown
          name: '7898095297749'
          struct: unknown
        }
      ]
      attribute_group_id: 'OTHERS'
      attribute_group_name: 'Otros'
    },
    {
      id: 'SELLER_SKU'
      name: 'SKU'
      value_id: unknown
      value_name: 'Test de SKU'
      value_struct: unknown
      values: [
        {
          id: unknown
          name: 'Test de SKU'
          struct: unknown
        }
      ]
      attribute_group_id: 'OTHERS'
      attribute_group_name: 'Otros'
    }
  ]
  warnings: []
  listing_source: ''
  variations: []
  status: 'active'
  sub_status: []
  tags: ['good_quality_picture', 'test_item', 'immediate_payment']
  warranty: 'Garantía del vendedor: 30 días'
  catalog_product_id: unknown
  domain_id: 'MLA-UNCLASSIFIED_PRODUCTS'
  seller_custom_field: unknown
  parent_item_id: unknown
  differential_pricing: unknown
  deal_ids: []
  automatic_relist: boolean
  date_created: '2021-09-13T00:38:30.000Z'
  last_updated: '2022-03-19T22:01:28.000Z'
  health: 0.6
  catalog_listing: boolean
  item_relations: []
  channels: ['marketplace']
}

declare module 'express-session' {
  interface Session {
    userId: string
  }
}

export interface MeliApiError {
  message: string
  error: string
  status: number
  cause: string[]
}

export interface MeliOauthResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  user_id: number
  refresh_token: string
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
  questions: MeliQuestionData[]
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

export interface MeliItemData {
  id: string
  site_id: string
  title: string
  seller_id: number
  category_id: string
  price: number
  currency_id: string
  initial_quantity: number
  available_quantity: number
  sold_quantity: number
  condition: string
  permalink: string
  thumbnail: string
  secure_thumbnail: string
  shipping: {
    free_shipping: boolean
  }
  attributes: object[]
  channels: string[]
}

export interface MeliOrdersResponse {
  query: string
  results: MeliSimpleOrderData[]
  sort: {}
  paging: {}
  display: string
}

export interface ApiOrdersResponse {
  orders: MeliCompleteOrderData[]
}

export interface MeliSimpleOrderData {
  seller: {
    nickname: string
    id: number
  }
  payments: [
    {
      reason: string
      status_code: any
      transaction_amount_refunded: number
      total_paid_amount: number
      operation_type: string
      transaction_amount: number
      date_approved: Date
      collector: {
        id: number
      }
      coupon_id: any
      installments: number
      authorization_code: string
      taxes_amount: number
      id: number
      date_last_modified: Date
      coupon_amount: number
      available_actions: string[]
      shipping_cost: number
      installment_amount: number
      date_created: Date
      activation_uri: any
      overpaid_amount: number
      card_id: any
      status_detail: string
      issuer_id: string
      payment_method_id: string
      payment_type: string
      deferred_period: any
      atm_transfer_reference: {
        transaction_id: string
        company_id: any
      }
      site_id: string
      payer_id: number
      order_id: number
      currency_id: string
      status: string
      transaction_order_id: any
    }
  ]
  fulfilled: boolean
  taxes: {
    amount: any
    id: any
    currency_id: any
  }
  order_request: {
    change: any
    return: any
  }
  expiration_date: Date
  feedback: {
    sale: any
    purchase: any
    buyer: any
    seller: any
  }
  shipping: {
    id: any
  }
  date_closed: Date
  id: number
  manufacturing_ending_date: any
  order_items: [
    {
      item: {
        seller_custom_field: any
        condition: string
        global_price: any
        category_id: string
        variation_id: any
        variation_attributes: []
        seller_sku: string
        warranty: string
        id: string
        title: string
        net_weight: any
      }
      quantity: number
      sale_fee: number
      requested_quantity: {
        measure: string
        value: number
      }
      element_id: any
      unit_price: number
      picked_quantity: any
      listing_type_id: string
      full_unit_price: number
      bundle: any
      currency_id: string
      manufacturing_days: any
    }
  ]
  date_last_updated: Date
  last_updated: Date
  pack_id: any
  coupon: {
    amount: number
    id: any
  }
  date_created: Date
  pickup_id: any
  status_detail: any
  tags: string[]
  buyer: {
    nickname: string
    id: number
  }
  total_amount: number
  paid_amount: number
  comment: any
  currency_id: string
  status: string
  mediations: []
}

export interface MeliCompleteOrderData {
  id: number
  date_created: Date
  date_closed: Date
  last_updated: Date
  manufacturing_ending_date: any
  comment: any
  pack_id: any
  pickup_id: any
  order_request: {
    return: any
    change: any
  }
  fulfilled: boolean
  mediations: []
  total_amount: number
  paid_amount: number
  coupon: {
    id: any
    amount: number
  }
  expiration_date: Date
  order_items: [
    {
      item: {
        id: string
        title: string
        category_id: string
        variation_id: any
        seller_custom_field: any
        variation_attributes: []
        warranty: string
        condition: string
        seller_sku: string
        global_price: any
        net_weight: any
      }
      quantity: number
      requested_quantity: {
        value: number
        measure: string
      }
      picked_quantity: any
      unit_price: number
      full_unit_price: number
      currency_id: string
      manufacturing_days: any
      sale_fee: number
      listing_type_id: string
    }
  ]
  currency_id: string
  payments: [
    {
      id: number
      order_id: number
      payer_id: number
      collector: {
        id: number
      }
      card_id: any
      site_id: string
      reason: string
      payment_method_id: string
      currency_id: string
      installments: number
      issuer_id: string
      atm_transfer_reference: {
        company_id: any
        transaction_id: string
      }
      coupon_id: any
      activation_uri: any
      operation_type: string
      payment_type: string
      available_actions: string[]
      status: string
      status_code: any
      status_detail: string
      transaction_amount: number
      transaction_amount_refunded: number
      taxes_amount: number
      shipping_cost: number
      coupon_amount: number
      overpaid_amount: number
      total_paid_amount: number
      installment_amount: number
      deferred_period: any
      date_approved: Date
      authorization_code: string
      transaction_order_id: any
      date_created: Date
      date_last_modified: Date
    }
  ]
  shipping: {
    id: any
  }
  status: string
  status_detail: any
  tags: string[]
  feedback: {
    buyer: any
    seller: any
  }
  buyer: {
    id: number
    nickname: string
    email: string
    first_name: string
    last_name: string
  }
  seller: {
    id: number
    nickname: string
    email: string
    first_name: string
    last_name: string
    phone: {
      extension: string
      area_code: string
      number: string
      verified: false
    }
    alternative_phone: {
      area_code: string
      extension: string
      number: string
    }
  }
  taxes: {
    amount: any
    currency_id: any
    id: any
  }
}
