
exports.filterNames = ( name ) => {
  return name
    .replace( 'hay_bale', 'hay_block' )
    .replace('Block_of_iron', 'iron_block' )
    .replace( 'Sweet_berries', 'sweet' )
}