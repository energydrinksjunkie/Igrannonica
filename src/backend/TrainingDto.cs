using backend.Models;

namespace backend
{
    public class TrainingDto
    {
        public string ClientConnID { get; set; } = string.Empty;
        public int DatasetID { get; set; }
        public string ProblemType { get; set; }
        public Layer[] Layers { get; set; } = Array.Empty<Layer>();
        public Column[] Features { get; set; }
        public Column[] Labels { get; set; }
        public string[] Metrics { get; set; }
        public string LossFunction { get; set; }
        public float TestDatasetSize { get; set; }
        public float ValidationDatasetSize { get; set; }
        public int Epochs { get; set; }
        public string Optimizer { get; set; }
        public float LearningRate { get; set; }
    }
}
