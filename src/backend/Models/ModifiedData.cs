namespace backend.Models
{
    public class ModifiedData
    {
        public Cell[] Edited { get; set; }

        public int[] DeletedRows { get; set; }
        public int[] DeletedCols { get; set; }  
    }
}
