using System.ComponentModel.DataAnnotations;
namespace backend.Models
{
    public class Dataset
    {
        [Key]
        public int Id { get; set; }
        public bool Public { get; set; }=false;
        [Required]
        public int UserID { get; set; } = 0;
        [Required]
        public string Path { get; set; }
        public string Description { get;set; }=string.Empty;
        [Required]
        public string Name { get; set; }=string.Empty;
        public string FileName { get; set; } = string.Empty;

        //public virtual List<DatasetDatasetTag> DatasetDatasetTags {  get; set;}
    }
}
