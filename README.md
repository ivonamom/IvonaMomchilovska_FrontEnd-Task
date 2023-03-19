# IvonaMomchilovska_FrontEnd-Task

This project implements a cards layout with load more functionality. It allows the user to change various display features by interacting with the settings widget.
The heart icon on each card is clickable and can be used to increase/decrease the likes count and change the heart icon color.
This project is created using vanillaJS and styled with plain CSS.

## Features

- Load More: Clicking the "Load More" button will load another four cards until all cards have been displayed. Once all cards are loaded, the "Load More" button is hidden.
- Number of Columns: The number of columns can be selected and the layout will update accordingly. The layout can have up to 5 columns and is responsive by default.
- Card Background Color: The card background color can be changed by inputting a new hexadecimal color in the input field.
- Cards Space Between: The space in between the cards can be changed by inputting a new value in the input field.
- Choose Theme: The card layout can be switched to a dark theme by checking the "Dark Theme" checkbox.
- Filter by Source: Cards can be filtered by source. Selecting "All" will display all posts again.

## Future Optimizations

> I am aware of a bug in the 'like posts' functionality on the popup, and I will fix it soon. However, due to time constraints, I am unable to address it at the moment. \

> Due to time constraints, the current code may not be fully optimized. I plan to continue working on this project and improving the code soon.

## Design & Prototype Link

A prototype of the project can be viewed here: \
 https://www.figma.com/proto/sMOQbcnymnnqcjfsdDgy81/TASK-Frontend?node-id=29%3A200

## Usage

1. Make an empty folder and access it using your terminal
2. Clone down this repository by running the following command in your terminal: \
   `git clone https://github.com/ivonamom/IvonaMomchilovska_FrontEnd-Task.git .`

3. Open the index.html file in a web browser.
4. Use the various settings to interact with the card layout.
   Enjoy!

## Development

To make changes to the app, follow these steps:

1. Create a new feature branch using git checkout -b my-feature-branch
2. Make changes to the codebase
3. Open the index.html file in a web browser.
4. When ready, commit your changes using git commit -am 'Add new feature'
5. Push your changes to the remote repository using git push
6. Create a pull request to merge your changes into the main branch

## What I Used

This project is created using vanillaJS and styled with plain CSS.

## Notes

- The widget is responsive and will display one post in a row on mobile (<768px), two posts in a row on tablets (<992px), and the selected number of columns on desktop (>992px).
- No 3rd party libraries or frameworks were used in the development of this project.

## Credits

This app was created as an assignment for Embed Social by Ivona Momchilovska.
