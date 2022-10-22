namespace backend.Models
{
    public class ResponseBase
    {
        public bool success { get; set; }
        public ResponseData data { get; set; }


        /// <summary>
        /// Konstruktor koji inicijalizuje promenljive status na false i token na prazan string
        /// </summary>
        public ResponseBase() 
        :  this(new List<ResponseError>())
        {
        }

        /// <summary>
        /// Konstruktor koji inicijalizuje promenljive status na false i token na prazan string, nakon
        /// cega inicijalizuje i promenljivu errors na ono sto je prosledjeno kao argument
        /// </summary>
        /// <param>
        /// <c>errors</c> je lista svih gresaka koje su se pojavile
        /// </param>
        public ResponseBase(List<ResponseError> errors) 
        {
            this.success = false;
            this.data = new ResponseData("", errors);
        }

        /// <summary>
        /// Konstruktor kojim se inicijalizuju sve promenljive objekat
        /// </summary>
        /// <param>
        /// <c>success</c> je indikator kojim se oznacava da li je zahtev uspesno obradjen ili ne
        /// </param>
        /// <param>
        /// <c>token</c> je JSON Web Token koji je dodeljen korisniku
        /// </param>
        /// <param>
        /// <c>errors</c> je lista svih gresaka koje su se pojavile
        /// </param>
        public ResponseBase(bool success, string token, List<ResponseError> errors) 
        {
            this.success = success;
            this.data = new ResponseData(token, errors);
        }

        public ResponseBase AddError(string message, string code)
        {
            this.data.errors.Add(new ResponseError(message, code));

            return this;
        }

        public ResponseBase AddError(ResponseError responseError)
        {
            this.data.errors.Add(responseError);

            return this;
        }
    }

    public class ResponseData
    {
        public string token { get; set; }
        public List<ResponseError> errors { get; set; }

        public ResponseData() 
        : this("", new List<ResponseError>())
        {
        }

        public ResponseData(string token, List<ResponseError> errors) 
        {
            this.token = token;
            this.errors = errors;
        }
    }

    public class ResponseError
    {
        public string message { get; set; }
        public string code { get; set; }

        public ResponseError() 
        : this("", "")
        {
        }

        public ResponseError(string message, string code) 
        {
            this.message = message;
            this.code = code;
        }
    }
}
