# Quality

## Testing for bias and other unwanted output

One of they key requirements for the application is that we make sure the application
doesn't generate photos that are in essence charicatures of people. So in short:
no extreme transformations in body parts, skin colors, etc.

To test for these mistakes we take a specific approach to testing:

1. First, we run a series of photos from https://this-person-does-not-exist.com/en
   through the application and manually verify that we're not getting unwanted outputs.
2. Next, we ask a group of colleagues to use the application during one of our internal
   events. By this time we've fixed any major issues, but the application could still
   produce unwanted output. We make sure that the colleagues are aware of this and they
   agree to help us test.

Using this approach we have a very high (at least 95%) chance that the application only
produces the results we want.

During testing we've seen that some people don't recognize themselves in the pictures.
This is acceptable, because we know that AI can produce hallucinations. None of the
invalid results were offensive though.

## Protection against offensive output with content filters

### Content Moderation with Azure Content Safety

The application uses Azure Content Safety to moderate both input and output of the image
generator. This provides comprehensive protection against harmful content throughout the
generation pipeline.

#### Moderation Categories

We validate content across four harm categories:

- Violence
- Self-harm
- Sexual explicit content
- Hate and fairness

#### Input Moderation

**Prompt Validation**: The text prompt provided by users is analyzed for harmful content
before being sent to the image generation model. We also made sure that the prompt has
placeholders instead of a free input text. This further narrows what can be achieved with
prompt injection.

**Webcam Image Validation**: The input photo from the webcam is analyzed to ensure it
doesn't contain harmful content before processing.

#### Output Moderation

**Generated Image Validation**: The image produced by the AI model is analyzed before
being presented to users, ensuring the output meets safety standards.

#### Blocking Threshold

Content is blocked if it scores 3 or higher on Azure's severity scale (0-7). This
threshold ensures that even moderately problematic content is prevented from entering
or leaving the system.

For more information about the harm categories and severity levels, see the
[Azure Content Safety documentation](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories?tabs=warning).