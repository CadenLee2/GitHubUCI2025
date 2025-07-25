# PetrWare

Our project for the 2025 GitHub x UCI Summer Hackathon!

PetrWare is a series of minigames about UCI culture, playable in your browser.

**For info on running the game, scroll down to [Running the Game](#development-running-the-game)**

![A screenshot of the Maze minigame](screenshots/Screenshot_MazeMinigame.png)

For contributors, this file documents how to run the game and develop new features.

If you want to play the game, scroll to the bottom for instructions!

## Development: Running the Game
You can run the game through GitHub Codespaces.
1. Click on the green Code button on GitHub, then navigate to Codespaces:
2. Launch the codespace `probable umbrella` (based on the `main` branch)
<img title="How to access the Codespace" src="screenshots/Screenshot_Codespaces.png" width="300">

Use the terminal to run the game from the `petrware` folder:
```sh
cd petrware
npm run dev
```

The game will run on `localhost:5173`.
If you're in Codespaces, a message should appear in the bottom right
with a button for you to visit the instance in your browser.

## Development: Contributing
Since this is a simple browser game, it's frontend-only. It is made using:
- Vite
- React
- Typescript

Since it's a series of minigames, they are provided sequentially through our React architecture
and linked together by the main `App.tsx` page.

To add a game:
- Create a folder under `petrware/src` named after your game (e.g. `maze_minigame`)
- In this folder, put all code internal to your game, like the main display, constants, and gameplay logic
- Be sure to clean up everything once the game ends! (i.e. clean up event handlers in `useEffect` statements)
- You can add needed assets in `petrware/src/assets`
- Link the game to the other games in `App.tsx`
```
                App.tsx
  ___________________________________
  |                      Score: xyz |
  |_________________________________|       your_game/YourGame.tsx
  |                                 |        ____________________
  |  <CurrentGame onFinish={...} />   <---->    props: onFinish |
  |                                 |        |                  |
  |   (State that persists across   |        | (Internal state) |
  |     games, like total score)    |        |                  |
  |                                 |        |                  |
  |                                 |        |__________________|
  |                                 |
  |_________________________________|
```
To help us collaborate, make sure to:
- Create a separate branch/fork with your changes then request to merge it in when you're done
- Try testing your changes on the Codespace (see [Running the Game](#development-running-the-game) above)

## Playing the Game

### Maze Minigame

<img width="1009" height="788" alt="image" src="https://github.com/user-attachments/assets/fef6bbd5-f65e-4eae-ac3e-8beab77d44c3" />


Controls: WASD or Arrow Keys to move around

Use stairs to navigate between floors

<img width="124" height="127" alt="image" src="https://github.com/user-attachments/assets/eb4deeb7-f44a-4b76-abd9-394bbdd55f6b" />

<img width="120" height="149" alt="image" src="https://github.com/user-attachments/assets/fa0d4ebe-204f-4bf2-af74-cf8176b7348c" />

Explore the map to find all your belongings!

Water Bottle
<img width="67" height="81" alt="image" src="https://github.com/user-attachments/assets/9f78828d-1966-42e9-ab37-4ed756d960f7" />

Backpack
<img width="80" height="81" alt="image" src="https://github.com/user-attachments/assets/4d6f0fb5-0b0d-4e98-8fb1-f17a57b855bf" />

Now escape to Ring Road!

### UTC Game

<img width="1026" height="809" alt="image" src="https://github.com/user-attachments/assets/17454dfb-14fb-451c-a331-9db8f2ff46ac" />


Controls: Click to hold the card and drag to swipe the card. Do it at the right speed to make sure the card reads correctly!

<img width="497" height="405" alt="image" src="https://github.com/user-attachments/assets/4ce1c003-f838-4f76-80f9-31a0517569af" />

<img width="486" height="431" alt="image" src="https://github.com/user-attachments/assets/536f101f-25b5-4eaa-88e1-2cdab50e831a" />

<img width="525" height="383" alt="image" src="https://github.com/user-attachments/assets/66cf6094-bc77-4fe6-b25d-79db98dc3719" />

### Ring Road Game

Controls: Use arrow keys to move around

Get to the other side of Ring Road and avoid all the bikes on the path!!

<img width="1004" height="803" alt="image" src="https://github.com/user-attachments/assets/185c7936-f23d-40a4-8079-88fa94776db2" />


### Photo-taking Game

Controls: Click the animals to take pictures of them

Taking photos of squirrels will give you a point, but taking a photo of a crow will cause you to lose points! Take as many photos of squirrels as you can in 30 seconds!

<img width="1004" height="788" alt="image" src="https://github.com/user-attachments/assets/ebbd279f-0622-4ca9-bcbe-fea4b99df516" />
