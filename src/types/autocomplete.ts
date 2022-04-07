import { AutocompleteApi, BaseItem, InternalAutocompleteSource } from '@algolia/autocomplete-core'
import { Hit } from '@algolia/client-search'
import { MeliItem, QuickAnswer } from './types'

export type AutocompleteItem = Hit<QuickAnswer | MeliItem>

export type SourceProps<TItem extends BaseItem> = {
  source: InternalAutocompleteSource<TItem>
  items: TItem[]
  autocomplete: AutocompleteApi<
    TItem,
    React.BaseSyntheticEvent<object, any, any>,
    React.MouseEvent<Element, MouseEvent>,
    React.KeyboardEvent<Element>
  >
}
