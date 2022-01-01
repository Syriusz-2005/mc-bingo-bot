
exports.filterNames = ( name ) => {
  return name
    .replace( 'hay_bale', 'hay_block' )
    .replace('block_of_iron', 'iron_block' )
    .replace( 'sweet_berries', 'sweet_berries' )
    .replace( 'minecart_with_chest', 'chest_minecart' )
    .replace( 'steak', 'cooked_beef' )
    .replace( 'leather_trousers', 'leather_leggings' )
    .replace( 'leather_pants', 'leather_leggings' )
    .replace( 'leather_tunic', 'leather_chestplate')
}