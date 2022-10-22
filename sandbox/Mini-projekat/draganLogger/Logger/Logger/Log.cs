using System;

namespace Logger
{
    public class Log
    {
        public Log(string id, string naziv, string opis, string date)
        {
            Id = id;
            Naziv = naziv;
            Opis = opis;
            Date = date;
        }
        public string Id { get; set; }
        public string Date { get; set; }

        public String Opis { get; set; }

        public string Naziv { get; set; }

    }
}