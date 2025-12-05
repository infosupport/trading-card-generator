namespace InfoSupport.TradingCardGenerator.Api.Shared;

public class EmbeddedResource
{
    public static string Read(string resourceName)
    {
        var assembly = typeof(EmbeddedResource).Assembly;
        var resourceStream = assembly.GetManifestResourceStream(resourceName);

        if (resourceStream == null)
        {
            throw new ArgumentException($"The specified resource {resourceName} was not found.");
        }
        
        using var reader = new StreamReader(resourceStream!);

        return reader.ReadToEnd();
    }
}