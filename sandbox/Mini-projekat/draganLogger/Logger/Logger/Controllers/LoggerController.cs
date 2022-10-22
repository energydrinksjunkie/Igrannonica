using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace Logger.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoggerController : ControllerBase
    {
        private readonly ILogger<LoggerController> _logger;
        static string konekcioni = @"Data Source=(localdb)\logger;Initial Catalog=logger;Integrated Security=True";
        SqlConnection conn = new SqlConnection(konekcioni);

        public LoggerController(ILogger<LoggerController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = @"select * from logs";
            
            SqlDataReader reader;
            
            conn.Open();
            SqlCommand comm = new SqlCommand(query, conn);
            reader = comm.ExecuteReader();
            List<Log> logs = new List<Log>();

            while(reader.Read())
            {
                logs.Add(new Log(reader["id"].ToString(), reader["naziv"].ToString(), reader["opis"].ToString(), reader["datum"].ToString()));
            }

            reader.Close();
            conn.Close();
            return new JsonResult(logs);

        }

        [HttpPost]
        public JsonResult Post(Log log)
        {
            string query = @"insert into logs(naziv,opis,datum) values('"+log.Naziv+"','"+log.Opis+"','"+DateTime.Now+"')";
            conn.Open();
            SqlCommand comm = new SqlCommand(query, conn);
            comm.ExecuteNonQuery();
            conn.Close();
            return new JsonResult("Uspesno ubacen");

        }


        [HttpDelete("{id}")]
        public JsonResult Delete(string id)
        {
            string query = @"delete from logs where id="+id;
            conn.Open();
            SqlCommand comm = new SqlCommand(query, conn);
            comm.ExecuteNonQuery();
            conn.Close();
            return new JsonResult("Uspesno izbrisan");

        }
    }
}
