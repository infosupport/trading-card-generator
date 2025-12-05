namespace InfoSupport.TradingCardGenerator.Shared;

public class ImageGenerationModelConnection
{
    private Dictionary<string, string?> _elements;

    private ImageGenerationModelConnection(Dictionary<string, string?> elements)
    {
        _elements = elements;
    }
    
    public static ImageGenerationModelConnection Parse(string rawValue)
    {
        var elements = new Dictionary<string, string?>();
        var keyValuePairs = rawValue.Split(';');

        foreach (var keyValuePair in keyValuePairs)
        {
            var values = keyValuePair.Split('=');

            if (string.IsNullOrEmpty(values[1]))
            {
                elements.Add(values[0], null);
            }
            
            elements.Add(values[0].Trim(), values[1].Trim());
        }

        return new ImageGenerationModelConnection(elements);
    }

    public string Endpoint => _elements["Endpoint"]!;

    public string DeploymentName => _elements["Deployment"]!;
}