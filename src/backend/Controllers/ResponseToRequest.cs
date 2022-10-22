namespace backend.Models
{
    public class ResponseToRequest
    { 
        public class Data
        {
            public string token { get; set; }
            public List<RequestError> errors { get; set; }
        }

        public class RequestError
        {
            public string message { get; set; }
            public string code { get; set; }
        }

        public bool success { get; set; }
        public Data data { get; set; }

        public ResponseToRequest()
        {
            this.data = new Data();
            this.data.errors = new List<RequestError>();
        }

        public ResponseToRequest(bool success, string token, string message, string code)
        : this()
        {
            this.success = success;
            this.data.token = token;
            this.data.errors.Add(new RequestError() { message = message, code = code });
        }
    }
}