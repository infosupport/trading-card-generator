# Model Card

This document contains the model card for the solution. Since we don't train any model, we've kept this model card
limited to the intended use, limitations, and safety sections.

## Intended use

This application is used as a showcase at the Info Support booth during the Techorama conference. Users can fill out
the following properties:

- They can choose a sport
- They can choose a team name
- They can choose a color

Then they can take a picture using the webcam. When they press submit, the application processes the information to
generate a sports card. The central photo on the card is generated using gpt-image-1. The rest of the elements were
manually designed and are composed with the photo.

## Limitations of the application

### Full body poses

Users can't specify in what pose their picture is processed. We only use the top-half of the body, from the shoulders
up to and including the face. We expect users to be able to stand up. If they can't stand, we can't fully ensure that
output is correct. We tested this with the help of someone in a wheelchair and found that it is important to have
the camera at eye level.

### Lighting conditions

The application only works with sufficient lighting and a good quality camera. Without it, it is unable to process the
photo into a reasonable trading card.

## Hardware and software

The application uses Azure OpenAI to host the gpt-image-1 model. It uses Azure Contenty Safety to validate the input
and output for harmful or unwanted content. It uses ASP.NET Core as the backend and React as the frontend.

## Responsibility and safety

### How is the application evaluated

The application is tested using synthetic photos and manually checked for output that's unwanted. We don't want poses
that can be considered offensive. We also don't want to deform body postures in a negative manner.

As an extra layer of defense we also test the application with a group of people from Info Support with 
diverse backgrounds. We involved female employees, employees with a non-white ethnic background, people with a 
physical limitation, and people of various body shapes. We tested with more than 30 people in total. 

We found no evidence that the application creates offensive output. We did find that in two cases the application
generated output that wasn't recognized as the person who took the picture. Changing the pose helped to fix this
problem.

### Monitoring and control

Despite our tests we can run into issues since we are dealing with a statistical application. We use Azure AI
Foundation to monitor the application. Any offensive content is automatically moderated and annotated for review.

### What data do we keep

We store no information of the users other than what's needed in case we run into a case where the output is flagged
by the moderation tooling.