using employee.api.Data.Entities;
using employee.api.Features.Employees.Contracts;

namespace employee.api.Features.Employees;

/// <summary>Translates between the EF entity and the public contracts. Keeps normalization rules in one place.</summary>
public static class EmployeeMapper
{
    public static EmployeeResponse ToResponse(this Employee employee) => new(
        employee.Id,
        employee.Name,
        employee.Mobile,
        employee.Email,
        employee.City,
        employee.Region,
        employee.Address);

    public static Employee ToEntity(this CreateEmployeeRequest request) => new()
    {
        Name = request.Name.Trim(),
        Mobile = request.Mobile.Trim(),
        Email = NormalizeEmail(request.Email),
        City = request.City.Trim(),
        Region = request.Region.Trim(),
        Address = request.Address.Trim(),
    };

    public static void ApplyTo(this UpdateEmployeeRequest request, Employee employee)
    {
        employee.Name = request.Name.Trim();
        employee.Mobile = request.Mobile.Trim();
        employee.Email = NormalizeEmail(request.Email);
        employee.City = request.City.Trim();
        employee.Region = request.Region.Trim();
        employee.Address = request.Address.Trim();
    }

    public static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
}
