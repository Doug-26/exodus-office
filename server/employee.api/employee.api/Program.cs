using employee.api.Data;
using employee.api.Data.Seeding;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<EmployeeDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ExodusOffice")));

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy("OfficePortal", policy =>
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    await DevelopmentSeeder.RunAsync(app.Services, app.Configuration);
}

app.UseHttpsRedirection();
app.UseCors("OfficePortal");
app.UseAuthorization();

app.MapControllers();

app.Run();

/// <summary>Exposed so integration tests can host the API with <c>WebApplicationFactory&lt;Program&gt;</c>.</summary>
public partial class Program;
