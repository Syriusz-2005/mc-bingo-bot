# mc-bingo-bot

mc-bingo-bot is a [mineflayer](https://github.com/PrismarineJS/mineflayer) - based bot that is able to play minecraft map called bingo.

The project is not done yet, but you can still install and use it however you want.

## Installation

```bash
git clone https://github.com/Syriusz-2005/mc-bingo-bot
cd mc-bingo-bot
npm install
```

Simple.

## Usage

```bash
npm run start name=<bot_name> host=<server> version=<mc_version>
```

After the bot joined you can use one of the following commands on the chat:

```
!hello
!analyze
!getItem <block_name> [count]
!restart
!winBingo
```

### Block types

Command !getItem works only for block types specified in:

```
bingo/goals.json
```

You can add your own blocks into goals.json using this schema:
```jsonc
{
  "items": {

    "<your_item_name>": {
      "conditions": [
        
        {
          "type": "<condition>",
          "name": "<condition_main_param>",

          //and optional values
          "recursive": false, //should item specified in "name" be found recursively
          "action_after_resolved": "[action_after_condition]",
        }

        //here you can add as many conditions as you want
        //If any condition is resolved, next conditions won't be checked

      ]
    }

  }
}
```

### Available conditions

All conditions checks for exeistence of item `your_item_name`.

- `inInventory` - Checks if the item is in bot inventory.
- `itemOnGround` - Checks if the item is on ground nearby and goes to it's position.
- `blockNearby` - Checks if there's a specified block nearby and mines it.

### Available actions

- `craft` - Tries to craft the `your_item_name`. For this action, `name` param should be a list of items that bot needs to craft `your_item_name`

  - ```json
    [
      {
        "requiredItem": "item_1",
        "requiredCount": 6
      },

      ...
    ]
    ```
- `recheckConditions` - force checks all conditions after 500 ms
  - When should be used? with condtion `blockNearby` - Item after breaking drops after some time, not in the same moment. You should use `blockNearby` with `recheckConditions` action to pickup dropped item!

- `smell` - Similar to `craft` except it does not need special `name` attribute only item name that should be smelt.

### Oder attributes

- `recursive` - Checks recursively for the needed item. Can create infinite loops when used uncorrectly
Used mostly when one item requires another to be crafted or smelted because if the bot doesn't have needed item in inventory, he can recursively find it.
- `count` - Used only in `smell` action where it means, that one item will give 1 smelted item.
- `resultsIn` - Used only in `craft` action where it means that crafting this item will result in exactly `resultsIn` items per craft.

