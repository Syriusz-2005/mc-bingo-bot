# mc-bingo-bot

mc-bingo-bot is a mineflayer-based bot that is able to play minecraft map called bingo.

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

After the bot joined you can use one of the following commands:

```
!hello
!analyze
!getBlock <block_name> [count]
```

Command !getBlock works only for block types specified in 

```
bingo/goals.json
```

You can add your own blocks into goals.json using this schema:
```jsonc
{
  "items": {

    "your_item_name": {
      "conditions": [
        
        {
          "type": "<condition_name>",
          "name": "<condition_main_param>",

          //and optional values
          "recursive": false, //should item specified in "name" be found recursively
          "action_after_resolved": "['craft'|'recheckConditions']",

          //for crafting action
          "count": 2, //how many items we need to craft <your_item_name>
          "resultsIn": 1 //how many items we are going to get after crafting
        }

        //here you can add as many conditions as you want
        //If any condition is resolved, next conditions won't be checked

      ]
    }

  }
}
```
