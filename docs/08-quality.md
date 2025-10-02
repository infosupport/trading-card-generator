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

Microsoft applies content filters to all their models. We apply these filters too to
ensure that no offensive names or descriptions enter the prompt that's used to generate
photos. We also made sure that the prompt has placeholders instead of a free input text.
This further narrows what can be achieved with prompt injection.