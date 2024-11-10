# Hadrian Process Chart
### Author: Khon Lieu

## Setup

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
2. Right now deleting edges will delete all incoming or outgoing edges. I'm quite sure we can create a custom edge to enable context menus for edges so that we can delete individual edges. I couldn't find a way to plug into context menus on their default edge.
3. ALso thought about creating tabs so that each tab showed a new instance of Chart, but ran out of time. It would have required to update to the storage process as well.
4. The code in `src/components/ui` are auto created by the chakra library
