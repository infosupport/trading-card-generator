# Building block view

This section covers the static structure of the solution.

## System context

![System context](system-context.png)

## Frontend

The Frontend uses NextJS to provide a nice interface to configure the settings for the
photo. It communicates with the Backend API to generate the photo for trading card.
The frontend composes the final trading card by combining the generated photo with
the static elements required for the photo.

## Backend API

The Backend API uses ASP.NET Core minimal APIs to implement an image generation endpoint.
We wrapped the logic to generate an image into an agent component to make the logic easier
to reason about.

![Backend API Structure](backend-building-blocks.png)