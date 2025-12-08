import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Products section
      S.listItem()
        .title('Products')
        .child(
          S.documentTypeList('product')
            .title('Products')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),
      // Collections section
      S.listItem()
        .title('Collections')
        .child(
          S.documentTypeList('collection')
            .title('Collections')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),
      // Homepage content
      S.listItem()
        .title('Homepage')
        .child(
          S.documentTypeList('homepage')
            .title('Homepage Content')
        ),
      // Orders section
      S.listItem()
        .title('Orders')
        .child(
          S.documentTypeList('order')
            .title('Orders')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),
      // Users section
      S.listItem()
        .title('Users')
        .child(
          S.documentTypeList('user')
            .title('Users')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),
      // Divider
      S.divider(),
      // All other document types
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['product', 'collection', 'homepage', 'order', 'user'].includes(
            listItem.getId() || ''
          )
      ),
    ])
