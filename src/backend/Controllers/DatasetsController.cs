using backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Web;
using Newtonsoft.Json;
using System.IO;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DatasetContext datasetContext;
        /*private readonly DatasetTagContext datasetTagContext;*/
        private static string _datasetFolderPath;
        private static string _microserviceBaseURL;
        private static readonly HttpClient _client = new HttpClient();
        private readonly IHttpContextAccessor _httpContext;

        public DatasetsController(DatasetContext datasetContext, IConfiguration configuration, IHttpContextAccessor httpContext/*,DatasetTagContext datasetTagContext*/)
        {
            this.datasetContext = datasetContext;
            _configuration = configuration;
            _microserviceBaseURL = _configuration["Addresses:Microservice"];
            _datasetFolderPath = _configuration["FileSystemRelativePaths:Datasets"];
            _httpContext = httpContext;/*
            this.datasetTagContext = datasetTagContext;*/
        }
        [Authorize]
        [HttpGet]
        [Route("")]
        public async Task<ActionResult<List<Dataset>>> fetchAllDatasets()
        {
            var userID = Convert.ToInt32(_httpContext.HttpContext.User.Claims.First(i => i.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber").Value);
            List<Dataset> lista = new List<Dataset>();
                lista = await this.datasetContext.Datasets.ToListAsync();
                //lista = await this.datasetTagContext.Datasets.Include(x => x.DatasetDatasetTags).ToListAsync();
                lista=lista.Where(x => x.UserID == userID).ToList();
                //lista = await this.datasetTagContext.Datasets.Include(x=>x.DatasetDatasetTags).ToListAsync();
                //lista = await this.datasetTagContext.DatasetDatasetTags.Include(x => x.Dataset).Where(entry => entry.DatasetId != 0).Select(entry => entry.Dataset).ToListAsync();
                //lista = await this.datasetTagContext.Datasets.Include(x=>x.DatasetDatasetTags).ToListAsync();
                
            return Ok(lista);
        }
        
        [HttpDelete]
        [Route("")]
        public async Task<ActionResult<string>> deleteDataset(int id)
        {
            var dataset = await this.datasetContext.Datasets.FindAsync(id);
            if (dataset== null)
            {
                return BadRequest("not find");
            }
            else
            {
                this.datasetContext.Datasets.Remove(dataset);
                // TODO dodati brisanje sa fajl sistema
                await this.datasetContext.SaveChangesAsync();
                return Ok("Its okey");
            }
        }

        [HttpPut]
        [Route("")]
        public async Task<ActionResult<string>> updateDataset(int id,[FromBody] datasetInfoDto data)
        {
            //var dataset = await this.datasetContext.Datasets.FindAsync(id); // TODO proveriti
            if (data.Name == "" || data.Description == "")
                return BadRequest("empty field");
            Dataset dataset = await this.datasetContext.Datasets.FindAsync(id);
            dataset.Name = data.Name;
            dataset.Description = data.Description;
            dataset.Public = data.Public;
            //datasetContext.Entry(data).State = EntityState.Modified;
            this.datasetContext.Datasets.Update(dataset);
            await datasetContext.SaveChangesAsync();
            return Ok(id);

        }


        [Authorize]
        [HttpPost]
        [Route("uploadWithLink")]
        public async Task<ActionResult<string>> uploadWithLink(datasetLinkInfoDto datasetDto)
        { // TODO dodati user id u request
            var microserviceURL = _microserviceBaseURL + "/data-preparation/parse";
            var userID = Convert.ToInt32(_httpContext.HttpContext.User.Claims.First(i => i.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber").Value);
            string url = datasetDto.Link;
            string responseString = null;
            
            try
             {
                var response = await _client.GetAsync(string.Format(microserviceURL + "?dataset_source={0}", url));
                response.EnsureSuccessStatusCode();
                responseString = await response.Content.ReadAsStringAsync();
            }
            catch(HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");	
                Console.WriteLine("Message :{0} ", e.Message);

                return BadRequest(new ResponseToRequest(false, "TODO", "Provided input is not a valid link!", "link_Invalid"));
            }

            Dataset dataset = new Dataset();
            dataset.UserID = userID;
            dataset.Path = "temp"; // TODO privremeno

            this.datasetContext.Datasets.Add(dataset);
            await this.datasetContext.SaveChangesAsync();

            if(url[url.Length-1] == '/')
                url = url.Remove(url.Length - 1, 1);

            string fileName = Path.ChangeExtension(Path.GetFileName(url), ".json");
            
            // Sacuvaj fajl
            string path = CreatePathToDataRoot(dataset.UserID, dataset.Id, fileName);
            using StreamWriter f = new(path);
            await f.WriteAsync(responseString);

            dataset.Path = path;
            dataset.FileName = fileName;
            dataset.Name = datasetDto.Name;
            dataset.Description = datasetDto.Description;
            dataset.Public = datasetDto.Public;
            this.datasetContext.Datasets.Update(dataset);
            await this.datasetContext.SaveChangesAsync();

            return Ok(dataset.Id);
        }
        [Authorize]
        [HttpPost]
        [DisableRequestSizeLimit,
        RequestFormLimits(MultipartBodyLengthLimit = int.MaxValue,
        ValueLengthLimit = int.MaxValue)]
        [Route("uploadFile")]
        public async Task<ActionResult<List<Dataset>>> uploadFile(IFormFile file)
        { // TODO dodati user id u request

            var userID = Convert.ToInt32(_httpContext.HttpContext.User.Claims.First(i => i.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber").Value);

            if (file.Length == 0)
            {
                return BadRequest("empty file");
            }

            var datasetInfo = new datasetInfoDto();

            try
            {
                datasetInfo = JsonConvert.DeserializeObject<datasetInfoDto>(Request.Form["data"]);

            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

            // Formiranje i slanje zahteva za parsiranje //

            using var _x = file.OpenReadStream();

            var fileStreamContent = new StreamContent(_x);
            fileStreamContent.Headers.ContentType = new MediaTypeHeaderValue("text/csv");

            var multipartFormContent = new MultipartFormDataContent();
            multipartFormContent.Add(fileStreamContent, name: "dataset_source", fileName: file.FileName);

            var url = _microserviceBaseURL + "/data-preparation/parse-file";

            string responseString = null;
            try 
            {
                var response = await _client.PostAsync(url, multipartFormContent);
                response.EnsureSuccessStatusCode();
                responseString = await response.Content.ReadAsStringAsync();
            }
            catch(HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");	
                Console.WriteLine("Message :{0} ", e.Message);

                return BadRequest(new ResponseToRequest(false, "TODO", "An error occured while uploading a file", "fileUpload_UnknownError"));
            }

            // Sacuvaj parsirane podatke u bazu i na fs //

            Dataset dataset = new Dataset();
            dataset.UserID = userID;
            dataset.Path = "temp";

            this.datasetContext.Datasets.Add(dataset);
            await this.datasetContext.SaveChangesAsync();

            string fileName = Path.ChangeExtension(file.FileName, ".json");

            string path = CreatePathToDataRoot(dataset.UserID, dataset.Id, fileName);
            using StreamWriter f = new(path);
            await f.WriteAsync(responseString);

            dataset.Path = path;
            dataset.FileName = fileName;
            dataset.Name = datasetInfo.Name;
            dataset.Description = datasetInfo.Description;
            dataset.Public = datasetInfo.Public;
            this.datasetContext.Datasets.Update(dataset);
            await this.datasetContext.SaveChangesAsync();

            return Ok(dataset.Id);
        }

        [HttpGet]
        [Route("{datasetId}/stat-indicators")]
        public async Task<ActionResult<string>> fetchStatisticalIndicators(int datasetId)
        {
            Dataset dataset = await this.datasetContext.Datasets.FindAsync(datasetId);
            
            var url = _microserviceBaseURL + "/dataset/stat-indicators";
            var donwloadUrl = CreateDatasetURL(_configuration, dataset.UserID, datasetId, dataset.FileName);
            
            string responseString = null;

            try
            {
                var response = await _client.GetAsync($"{url}?stored_dataset={donwloadUrl}");
                response.EnsureSuccessStatusCode();
                responseString = await response.Content.ReadAsStringAsync();
            }
            catch(HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");	
                Console.WriteLine("Message :{0} ", e.Message);

                return BadRequest(new ResponseToRequest(false, "TODO", "An error occured while fetching statistical indicators", "stats_UnknownError"));
            }

            return Ok(responseString);
        }

        [HttpGet]
        [Route("{datasetId}/corr-matrix")]
        public async Task<ActionResult<string>> getCorrMatrix(int datasetId)
        {
            Dataset dataset = await this.datasetContext.Datasets.FindAsync(datasetId);

            var url = _microserviceBaseURL + "/dataset/corr-matrix";
            var donwloadUrl = CreateDatasetURL(_configuration, dataset.UserID, datasetId, dataset.FileName);

            string responseString = null;

            try 
            {
                var response = await _client.GetAsync($"{url}?stored_dataset={donwloadUrl}");
                response.EnsureSuccessStatusCode();
                responseString = await response.Content.ReadAsStringAsync();
            }
            catch(HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");	
                Console.WriteLine("Message :{0} ", e.Message);

                return BadRequest(new ResponseToRequest(false, "TODO", "An error occured while fetching correlation matrix", "corrMat_UnknownError"));
            }

            return Ok(responseString);
        }

        [HttpGet]
        [Route("{datasetId:int}/Data")]
        public async Task<ActionResult<string>> fetchDatasetFile(int datasetId, int userId = 0) // TODO razmotriti resenje sa userId-om u buducnosti
        { // TODO paginacija
            var dataset = datasetContext.Datasets.FirstOrDefault(x => x.Id == datasetId);

            if (dataset == null)
                return BadRequest(new { Message = "No dataset with this id found" });

            string url = CreateDatasetURL(_configuration, userId, datasetId, dataset.FileName).Replace(_configuration["Addresses:Backend"], "~");
            
            return LocalRedirect(url);
        }

        [HttpPost]
        [Route("{datasetId:int}/modifyData")]
        public async Task<ActionResult<Object>> modifyData(int datasetId, [FromBody] ModifiedData data)
        {
            var dataset = await this.datasetContext.Datasets.FindAsync(datasetId);

            if (dataset == null)
            {
                return BadRequest(new { Message = "No dataset with this id" });
            }
            else
            {
                var microserviceURL = _microserviceBaseURL + "/data-preparation/modify";

                string url = CreateDatasetURL(_configuration, dataset.UserID, dataset.Id, dataset.FileName);

                string responseString = null;
                JObject json = null;
                try
                {
                    var response = await _client.PutAsJsonAsync(microserviceURL + "?stored_dataset=" + url, data);
                    response.EnsureSuccessStatusCode();
                    responseString = await response.Content.ReadAsStringAsync();
                    json = JObject.Parse(responseString);

                }
                catch(HttpRequestException e)
                {
                    Console.WriteLine("\nException Caught!");
                    Console.WriteLine("Message :{0} ", e.Message);

                    return BadRequest(new ResponseToRequest(false, "TODO", "An error occured while modifying dataset", "datasetModify_UnknownError"));
                }

                StreamWriter f = new(dataset.Path);
                f.Write(responseString);
                f.Close();
                
                return Ok(new { basicInfo = json.GetValue("basicInfo").ToString(), missingValues = json.GetValue("missingValues").ToString() });
            }

        }

        [HttpPost]
        [Route("{datasetId:int}/fillMissing")]
        public async Task<ActionResult<Object>> fillMissingValues(int datasetId, [FromBody]ColumnFillMethodPair[] columnFillMethodPairs)
        {
            var dataset = await this.datasetContext.Datasets.FindAsync(datasetId);

            if (dataset == null)
                return BadRequest(new { Message = "No dataset with this id" });
        
            var microserviceURL = _microserviceBaseURL + "/data-preparation/fill-missing";

            string url = CreateDatasetURL(_configuration, dataset.UserID, dataset.Id, dataset.FileName);

            string responseString = null;

            try
            {
                var response = await _client.PutAsJsonAsync(microserviceURL + "?stored_dataset=" + url, columnFillMethodPairs);
                response.EnsureSuccessStatusCode();
                responseString = await response.Content.ReadAsStringAsync();
            }
            catch(HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");	
                Console.WriteLine("Message :{0} ", e.Message);

                return BadRequest(new ResponseToRequest(false, "TODO", "An error occured while filling missing values", "fillMissingValues_UnknownError"));
            }

            StreamWriter f = new(dataset.Path);
            f.Write(responseString);
            f.Close();

            return Ok(new { Message = "OK" } );
        }

        // TODO premestiti logiku za kreiranje root foldera dataset-ova prilikom pokretanja aplikacije
        private string CreatePathToDataRoot(int userID, int datasetID, string filename)
        {
            var rootDirPath = $"{_datasetFolderPath}/{userID}/{datasetID}";

            Directory.CreateDirectory(rootDirPath);

            rootDirPath = rootDirPath.Replace(@"\", "/");

            return $"{rootDirPath}/{filename}";
        }

        // TODO razmotriti mogucnost drugacije implementacije ove metode
        public static string CreateDatasetURL(IConfiguration configuration, int userID, int datasetID, string filename)
        {
            string datasetsVirtPath = configuration["VirtualFolderPaths:Datasets"];
            string backendURL = configuration["Addresses:Backend"];
            
            return $"{backendURL}/{datasetsVirtPath}/{userID}/{datasetID}/{filename}";
        }

        /*[HttpPost]
        [Route("tag")]
        public async Task<ActionResult<List<Dataset>>> addTag(string name,int id)
        {
            Dataset set =await datasetTagContext.Datasets.FindAsync(id);
            DatasetTag tag = new DatasetTag();
            tag.Tag = name;
            
            DatasetDatasetTag ddt = new DatasetDatasetTag();
            ddt.Dataset = set;
            ddt.DatasetTag = tag;
  
            datasetTagContext.DatasetDatasetTags.Add(ddt);
            await datasetTagContext.SaveChangesAsync();
        
            return Ok();
        }*/

        [HttpGet]
        [Route("filter")]
        public async Task<ActionResult<List<Dataset>>> filterDatasets(string? param)
        {
            List<Dataset> lista = new List<Dataset>();
            lista = await this.datasetContext.Datasets.Where(
                x => x.Name.Contains(param) || x.Description.Contains(param)
                ).ToListAsync();

            return Ok(lista);
        }
    }
}
