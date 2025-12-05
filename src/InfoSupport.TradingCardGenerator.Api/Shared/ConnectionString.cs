namespace InfoSupport.TradingCardGenerator.Shared;

public class ConnectionString
{
    private Dictionary<string, string?> _elements;

    private ConnectionString(Dictionary<string, string?> elements)
    {
        _elements = elements;
    }
    
    public static ConnectionString Parse(string rawValue)
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

        return new ConnectionString(elements);
    }

    public string? this[string key] => _elements.ContainsKey(key) ? _elements[key] : null;
}