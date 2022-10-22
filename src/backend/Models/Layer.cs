namespace backend.Models
{
    public class Layer
    {
        public int index { get; set; }
        public int units { get; set; }
        public string weight_initializer { get; set; }
        public string activation_function { get; set; }
    }
}
