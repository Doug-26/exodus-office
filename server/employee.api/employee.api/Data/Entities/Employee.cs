namespace employee.api.Data.Entities;

/// <summary>
/// Persistence model for an employee. Never returned directly from the API;
/// see <see cref="Features.Employees.Contracts.EmployeeResponse"/> for the public contract.
/// </summary>
public class Employee
{
    public int Id { get; set; }

    public required string Name { get; set; }

    /// <summary>Philippine mobile number stored as 10 digits without the country code, e.g. 9171234567.</summary>
    public required string Mobile { get; set; }

    public required string Email { get; set; }

    public required string City { get; set; }

    public required string Region { get; set; }

    public required string Address { get; set; }
}
