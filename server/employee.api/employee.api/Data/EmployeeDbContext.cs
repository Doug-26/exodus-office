using employee.api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace employee.api.Data;

public class EmployeeDbContext(DbContextOptions<EmployeeDbContext> options) : DbContext(options)
{
    public DbSet<Employee> Employees => Set<Employee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>(employee =>
        {
            employee.ToTable("Employees");
            employee.HasKey(e => e.Id);
            employee.Property(e => e.Name).HasMaxLength(EmployeeLimits.NameMaxLength).IsRequired();
            employee.Property(e => e.Mobile).HasMaxLength(EmployeeLimits.MobileLength).IsFixedLength().IsRequired();
            employee.Property(e => e.Email).HasMaxLength(EmployeeLimits.EmailMaxLength).IsRequired();
            employee.Property(e => e.City).HasMaxLength(EmployeeLimits.CityMaxLength).IsRequired();
            employee.Property(e => e.Region).HasMaxLength(EmployeeLimits.RegionMaxLength).IsRequired();
            employee.Property(e => e.Address).HasMaxLength(EmployeeLimits.AddressMaxLength).IsRequired();
            employee.HasIndex(e => e.Email).IsUnique();
        });
    }
}

/// <summary>Single source of truth for field limits shared by the entity configuration and the request validation.</summary>
public static class EmployeeLimits
{
    public const int NameMaxLength = 100;
    public const int MobileLength = 10;
    public const int EmailMaxLength = 254;
    public const int CityMaxLength = 100;
    public const int RegionMaxLength = 100;
    public const int AddressMaxLength = 500;
}
