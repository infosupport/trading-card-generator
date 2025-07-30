namespace InfoSupport.TradingCardGenerator.Shared;

public class EmbeddedResource
{
    public static string Read(string resourceName)
    {
        var assembly = typeof(EmbeddedResource).Assembly;
        var resourceStream = assembly.GetManifestResourceStream(
            $"InfoSupport.TradingCardGenerator.{resourceName}");

        if (resourceStream == null)
        {
            throw new ArgumentException($"The specified resource {resourceName} was not found.");
        }
        
        using var reader = new StreamReader(resourceStream!);

        return reader.ReadToEnd();
    }
}