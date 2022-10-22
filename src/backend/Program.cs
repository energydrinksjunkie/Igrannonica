using backend;
using backend.Data;
using backend.Models;
using backend.Services;
using backend.WS;

using System.IO;
using System.Net;
using System.Net.WebSockets;
using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

var MyAllowSpecificOrigins = "MyAllowSpecificOrigins";


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        builder =>
        {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        });
});

ConfigurationManager configuration = builder.Configuration;

builder.Services.AddControllers();

builder.Services.AddDbContext<UserContext>(options => {
    // User
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")); 
});

builder.Services.AddDbContext<DatasetContext>(options => {
    // Dataset
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

/*builder.Services.AddDbContext<DatasetTagContext>(options => {
    // Dataset
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});*/

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,

        ValidAudience = configuration["JWT:ValidAudience"],
        ValidIssuer = configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))

    };
});

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddWebSocketServerConnectionManager();
// Email sender
builder.Services.AddTransient<IEmailSender, EmailSender>();

// TODO koristi se za prod
// builder.WebHost.ConfigureKestrel((context, serverOptions) =>
//     {
//         serverOptions.Listen(IPAddress.Any, 10079);
//     }
// );
var app = builder.Build();


/*
// Primena migracija u prilikom pokretanja //
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<UserContext>();

    if (!(db.Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator).Exists())
        db.Database.Migrate();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DatasetContext>();

    if(! (db.Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator).Exists())
        db.Database.Migrate();
}*/

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// kreiranje foldera za dataset-ove
Directory.CreateDirectory(builder.Configuration["FileSystemRelativePaths:Datasets"]);

app.UseStaticFiles(); // TODO proveriti da li je ova linija neophodna

app.UseStaticFiles(new StaticFileOptions()
{
    // Kreiranje statickog foldera za dataset-ove
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), builder.Configuration["FileSystemRelativePaths:Datasets"])),
    RequestPath = new PathString("/" + builder.Configuration["VirtualFolderPaths:Datasets"]),
    OnPrepareResponse = context =>
    {
        context.Context.Response.Headers["Access-Control-Allow-Origin"] = "*";
    }
});

var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};

//SOKETI
app.UseWebSockets(webSocketOptions);
app.UseWebSocketServer();


app.UseCors(MyAllowSpecificOrigins);

app.UseRouting();

/*app.UseEndpoints(endpoints =>
{   
    endpoints.MapControllers();
    endpoints.MapHub<SocketHub>("/SocketHub");
});*/

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
