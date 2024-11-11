# Hadrian Process Chart
### Author: Khon Lieu

## Setup

Pre-condition:

Use NVM to install node `v20.15.0`. I believe anything above `v20` should be fine. I know for sure `>=v20.15.0` works.

Install dependencies:
   ```bash
  npm install
   ````

## Start
Run the project in dev:
   ```bash
   npm run dev
   ````
Visit
   ```
      http://localhost:5173/
   ```

## Note
1. To delete nodes or edges, right click on a node to show a context menu.
2. To edit the label of a node, double click on the text in the node
4. To enable "interactive mode", click the switch button for interactive mode
5. Right now deleting edges will delete all incoming or outgoing edges. I'm quite sure we can create a custom edge to enable context menus for edges so that we can delete individual edges. I couldn't find a way to plug into context menus on their default edge.
6. ALso thought about creating tabs so that each tab showed a new instance of Chart, but ran out of time. It would have required to update to the storage process as well.
7. The code in `src/components/ui` are auto created by the chakra library
8. I didn't modify it for mobile, it's going to take more time. I did test it in the browser. I usually test on device as well. 
