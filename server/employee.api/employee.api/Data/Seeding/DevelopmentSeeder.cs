using employee.api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace employee.api.Data.Seeding;

/// <summary>
/// Development-only startup step: applies pending migrations and, when <c>Seeding:Enabled</c> is true
/// and the table is empty, inserts the Exodus home office team so the directory is never blank locally.
/// Edit <see cref="TeamMembers"/> to match the real team; contact details here are placeholders on purpose.
/// </summary>
public static class DevelopmentSeeder
{
    public static async Task RunAsync(IServiceProvider services, IConfiguration configuration, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<EmployeeDbContext>();

        await db.Database.MigrateAsync(cancellationToken);

        if (!configuration.GetValue<bool>("Seeding:Enabled") || await db.Employees.AnyAsync(cancellationToken))
        {
            return;
        }

        db.Employees.AddRange(TeamMembers());
        await db.SaveChangesAsync(cancellationToken);
    }

    public static IReadOnlyList<Employee> TeamMembers() =>
    [
        Member("Christian Jay De La Cruz", "christian.delacruz", "9000000001"),
        Member("Jovy Jay De La Cruz", "jovy.delacruz", "9000000002"),
        Member("Team Member Three", "member.three", "9000000003"),
        Member("Team Member Four", "member.four", "9000000004"),
        Member("Team Member Five", "member.five", "9000000005"),
    ];

    private static Employee Member(string name, string mailbox, string mobile) => new()
    {
        Name = name,
        Mobile = mobile,
        Email = $"{mailbox}@exodus-office.local",
        City = "Naga",
        Region = "Bicol",
        Address = "Exodus home office",
    };
}
